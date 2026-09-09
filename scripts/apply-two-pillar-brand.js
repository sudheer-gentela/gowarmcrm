#!/usr/bin/env node
/**
 * apply-two-pillar-brand.js
 *
 *   node scripts/apply-two-pillar-brand.js --dry-run
 *   node scripts/apply-two-pillar-brand.js
 *
 * Rebrands the header across the site for the two-pillar structure:
 *   - wordmark becomes "GoWarm" (parent brand) plus a section label
 *   - nav becomes  Home / GoWarm CRM / GoWarm Work / Pricing / Insights / Demo
 *
 * Idempotent: re-running reports every page as already applied.
 * index.html, sales.html, work.html and why-you-stopped-knowing.html are
 * authored with the new header already and are skipped.
 */
'use strict';
const fs = require('fs'), path = require('path');
const DRY = process.argv.includes('--dry-run');
const argRoot = process.argv.slice(2).find(a => !a.startsWith('--'));
const ROOT = [argRoot, process.cwd(), path.join(__dirname, '..')].filter(Boolean)
  .find(p => { try { return fs.existsSync(path.join(p, 'website', 'index.html')); } catch { return false; } });
if (!ROOT) { console.error('Run from the site root.'); process.exit(2); }

const LOGO_SVG = '<svg width="22" height="22" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;margin-right:7px;flex-shrink:0"><rect width="72" height="72" rx="16" fill="#E8630A"/><path d="M36 10 C26 18 14 27 16 44 C18 57 27 66 36 70 C45 66 54 57 56 44 C58 27 46 18 36 10Z" fill="#F5A623"/><path d="M36 26 C32 32 27 39 29 47 C31 53 34 58 36 61 C38 58 41 53 43 47 C45 39 40 32 36 26Z" fill="#FDE68A"/><path d="M23 47 L27 59 L32 50 L36 57 L40 50 L45 59 L49 47" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.95"/></svg>';

// pages that belong to a pillar get that pillar's label and nav highlight
const WORK  = new Set(['work.html', 'why-you-stopped-knowing.html']);
const NEUTRAL = new Set(['index.html', 'pricing.html', 'contact.html', 'about.html',
  'platform-overview.html', 'skills.html', 'insights.html', 'terms.html', 'privacy.html',
  'msa.html', 'dpa.html', 'install-extension.html']);
// everything else under website/ is sales-cluster

function classify(rel) {
  const base = path.basename(rel);
  if (base === 'sales.html') return { label: 'CRM', active: '/sales' };
  if (WORK.has(base))        return { label: 'Work', active: '/work' };
  if (NEUTRAL.has(base))     return { label: null, active: base === 'index.html' ? '/' : '/' + base.replace('.html', '') };
  return { label: 'CRM', active: '/sales' };
}

function header({ label, active }) {
  const items = [['/', 'Home'], ['/sales', 'GoWarm CRM'], ['/work', 'GoWarm Work'],
                 ['/pricing', 'Pricing'], ['/blog', 'GoWarm Insights']];
  const lis = items.map(([h, t]) =>
    `          <li><a href="${h}"${h === active ? ' class="active"' : ''}>${t}</a></li>`).join('\n');
  const lab = label ? `<i class="nav-sec">${label}</i>` : '';
  return `  <header class="site-nav">
    <div class="container">
      <a href="/" class="nav-logo" style="display:flex;align-items:center;">${LOGO_SVG}GoWarm${lab}</a>
      <nav>
        <ul class="nav-links">
${lis}
          <li><a href="/contact" class="nav-cta">Book a Demo</a></li>
        </ul>
      </nav>
      <button class="nav-hamburger" aria-label="Open menu" onclick="toggleMobileNav()"><span></span><span></span><span></span></button>
    </div>
  </header>`;
}

const files = [];
for (const dir of [path.join(ROOT, 'website'), path.join(ROOT, 'website', 'ai-shift')]) {
  if (!fs.existsSync(dir)) continue;
  for (const n of fs.readdirSync(dir)) if (n.endsWith('.html')) files.push(path.join(dir, n));
}

let changed = 0, done = 0, noHeader = [];
for (const file of files.sort()) {
  const rel = path.relative(ROOT, file);
  let src = fs.readFileSync(file, 'utf8');
  if (!/<header class="site-nav">[\s\S]*?<\/header>/.test(src)) { noHeader.push(rel); continue; }
  const next = src.replace(/  <header class="site-nav">[\s\S]*?<\/header>/, () => header(classify(rel)));
  if (next === src) { done++; console.log(`  = ${rel}`); continue; }
  if (!DRY) fs.writeFileSync(file, next);
  changed++; console.log(`  + ${rel}${DRY ? '  (dry run)' : ''}`);
}
if (noHeader.length) console.log(`\n  no .site-nav header, left alone: ${noHeader.join(', ')}`);
console.log(`\n[two-pillar-brand] ${changed} changed, ${done} already current.`);
