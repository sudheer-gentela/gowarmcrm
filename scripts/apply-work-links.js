#!/usr/bin/env node
/**
 * apply-work-links.js
 *
 *   node scripts/apply-work-links.js --dry-run     show every change, write nothing
 *   node scripts/apply-work-links.js               apply
 *
 * Wires the GoWarm Work articles into the rest of the site with contextual,
 * in-sentence links. Four passes, all idempotent — run it twice and the second
 * run reports "already" for everything and writes nothing.
 *
 *   1. LINKS      wraps an existing phrase in a link, inside a sentence that is
 *                 already about the target page. No copy is added or reworded.
 *                 34 links across 9 website pages and 3 blog posts.
 *   2. MARKDOWN   adds the same targets to the "## Related reading" list of each
 *                 page's markdown copy (what agents get with Accept: text/markdown),
 *                 skipping any URL that list already contains.
 *   3. BLOG CSS   adds one rule to blog/style.css so links inside article bodies
 *                 are visible. Today they inherit the body colour with no
 *                 underline, including the existing GoWarm Work links.
 *   4. SITEMAP    adds the three Work blog posts, which are missing from
 *                 sitemap.xml, and sets <lastmod> to today for every URL whose
 *                 file this run actually changed.
 *
 * Each LINK is matched by a context string that must occur exactly once in the
 * file. If the copy has since been edited and the context no longer matches,
 * that link is reported as NOT FOUND and skipped; everything else still applies,
 * and the script exits with code 1 so the miss is not silent.
 *
 * Line endings and all surrounding markup are preserved: every edit replaces a
 * short exact string in place rather than rewriting the file.
 *
 * Run against the website repo root (the directory holding website/, blog/,
 * markdown/ and sitemap.xml), or pass the root as the first non-flag argument.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DRY = process.argv.includes('--dry-run');
const argRoot = process.argv.slice(2).find((a) => !a.startsWith('--'));

/* ── locate the repo root ──────────────────────────────────────────────── */

const ROOT = [argRoot, process.env.GW_SITE_ROOT, process.cwd(), path.join(__dirname, '..')]
  .filter(Boolean)
  .find((p) => {
    try {
      return (
        fs.existsSync(path.join(p, 'website', 'work.html')) &&
        fs.existsSync(path.join(p, 'blog', 'style.css')) &&
        fs.existsSync(path.join(p, 'sitemap.xml'))
      );
    } catch {
      return false;
    }
  });

if (!ROOT) {
  console.error('Could not find the site root (expected website/work.html, blog/style.css and sitemap.xml).');
  console.error('Run from the repo root, or pass the root path as an argument.');
  process.exit(2);
}

const SITE = 'https://gowarmcrm.com';
const TODAY = new Date().toISOString().slice(0, 10);

/* ── link style ────────────────────────────────────────────────────────── */

// Website pages style links per section, and several sections (cards, feature
// lists, FAQ answers) have no link rule at all, so the style travels with the
// link. Blog pages get the stylesheet rule from pass 3 instead.
const WEBSITE_LINK_STYLE = 'color:var(--rust);text-decoration:underline;text-underline-offset:3px;';

/* ── 1. the link map ───────────────────────────────────────────────────── */
//
//   file     path from repo root
//   context  exact text that must occur once in the file; contains the anchor
//   anchor   exact text inside context that becomes the link
//   href     target path

const LINKS = [
  // ── /daily-work-tracking ──
  {
    file: 'website/daily-work-tracking.html',
    context: 'Three spellings of one activity become three lines in any summary, so the sheet can be read but never counted.',
    anchor: 'the sheet can be read but never counted',
    href: '/vs-spreadsheets',
  },
  {
    file: 'website/daily-work-tracking.html',
    context: 'Generated items arrive on a schedule; attention does not.',
    anchor: 'Generated items arrive on a schedule; attention does not',
    href: '/blog/when-your-tool-generates-work',
  },
  {
    file: 'website/daily-work-tracking.html',
    context: '<p>Recurring work that never completes is a first-class item,',
    anchor: 'Recurring work that never completes',
    href: '/standing-vs-timeboxed-work',
  },

  // ── /vs-spreadsheets ──
  {
    file: 'website/vs-spreadsheets.html',
    context: 'so a missing day is either expected or a real absence — and compliance becomes days logged divided by working days.',
    anchor: 'compliance becomes days logged divided by working days',
    href: '/daily-work-tracking',
  },
  {
    file: 'website/vs-spreadsheets.html',
    context: 'task dependencies validated for circularity when they are created, and stage gates that hold the next stage shut',
    anchor: 'stage gates that hold the next stage shut',
    href: '/project-tracking-software-small-business',
  },
  {
    file: 'website/vs-spreadsheets.html',
    context: 'an append-only spend ledger of increments, rates snapshotted on every entry',
    anchor: 'an append-only spend ledger of increments',
    href: '/blog/bill-of-quantities-vs-budget-line',
  },

  // ── /project-tracking-software-small-business ──
  {
    file: 'website/project-tracking-software-small-business.html',
    context: 'Tools that only model finite projects force the standing half into a permanently open item.',
    anchor: 'force the standing half into a permanently open item',
    href: '/standing-vs-timeboxed-work',
  },
  {
    file: 'website/project-tracking-software-small-business.html',
    context: 'because a spend ledger you can edit is not a ledger',
    anchor: 'a spend ledger you can edit is not a ledger',
    href: '/blog/bill-of-quantities-vs-budget-line',
  },
  {
    file: 'website/project-tracking-software-small-business.html',
    context: 'appears in no pipeline, and lives in a shared sheet nobody trusts.',
    anchor: 'a shared sheet nobody trusts',
    href: '/vs-spreadsheets',
  },

  // ── /standing-vs-timeboxed-work ──
  {
    file: 'website/standing-vs-timeboxed-work.html',
    context: 'The retainer is at ninety per cent because somebody had to put a number in a field',
    anchor: 'The retainer is at ninety per cent',
    href: '/blog/retainer-ninety-percent-complete',
  },
  {
    file: 'website/standing-vs-timeboxed-work.html',
    context: 'The retainer moves to a spreadsheet and the dashboard becomes clean again.',
    anchor: 'The retainer moves to a spreadsheet',
    href: '/vs-spreadsheets',
  },
  {
    file: 'website/standing-vs-timeboxed-work.html',
    context: 'It is fully tracked, fully logged against, and appears in the manager rollup',
    anchor: 'fully logged against',
    href: '/daily-work-tracking',
  },

  // ── /for-founders ──
  {
    file: 'website/for-founders.html',
    context: 'Projects with stages, gates and a baseline frozen at the start. Daily work written once by the person doing it,',
    anchor: 'Projects with stages, gates and a baseline frozen at the start',
    href: '/project-tracking-software-small-business',
  },
  {
    file: 'website/for-founders.html',
    context: 'Daily work written once by the person doing it, read on their own day',
    anchor: 'Daily work written once by the person doing it',
    href: '/daily-work-tracking',
  },
  {
    file: 'website/for-founders.html',
    context: 'Work that never finishes is tracked as its own mode, not a permanently open ticket',
    anchor: 'Work that never finishes is tracked as its own mode',
    href: '/standing-vs-timeboxed-work',
  },
  {
    file: 'website/for-founders.html',
    context: 'Bill of Quantities that behaves like a ledger, with variations kept separate',
    anchor: 'Bill of Quantities that behaves like a ledger',
    href: '/blog/bill-of-quantities-vs-budget-line',
  },

  // ── /why-you-stopped-knowing ──
  {
    file: 'website/why-you-stopped-knowing.html',
    context: 'Every tool that manufactures work arrives at this state eventually.',
    anchor: 'Every tool that manufactures work arrives at this state eventually',
    href: '/blog/when-your-tool-generates-work',
  },
  {
    file: 'website/why-you-stopped-knowing.html',
    context: 'Projects carry stages, gates, dependencies and a plan frozen at the start',
    anchor: 'Projects carry stages, gates, dependencies and a plan frozen at the start',
    href: '/project-tracking-software-small-business',
  },
  {
    file: 'website/why-you-stopped-knowing.html',
    context: 'Bills of quantity behave like ledgers, with corrections booked as reversals',
    anchor: 'Bills of quantity behave like ledgers',
    href: '/blog/bill-of-quantities-vs-budget-line',
  },
  {
    file: 'website/why-you-stopped-knowing.html',
    context: 'Daily work is one line a day, written by the person doing the work, stored in exactly one place',
    anchor: 'Daily work is one line a day',
    href: '/daily-work-tracking',
  },

  // ── /platform-overview ──
  {
    file: 'website/platform-overview.html',
    context: 'Stages with gates, task dependencies, a baseline frozen at start, evidence required to close',
    anchor: 'Stages with gates, task dependencies, a baseline frozen at start',
    href: '/project-tracking-software-small-business',
  },
  {
    file: 'website/platform-overview.html',
    context: 'Timeboxed and standing work are tracked separately.</div>',
    anchor: 'Timeboxed and standing work are tracked separately',
    href: '/standing-vs-timeboxed-work',
  },
  {
    file: 'website/platform-overview.html',
    context: '<div class="module-desc">One line a day from the person doing the work, read by their own day',
    anchor: 'One line a day from the person doing the work',
    href: '/daily-work-tracking',
  },

  // ── /pricing ──
  {
    file: 'website/pricing.html',
    context: 'Every project carries its stages, gates and frozen baseline.',
    anchor: 'Every project carries its stages, gates and frozen baseline',
    href: '/project-tracking-software-small-business',
  },
  {
    file: 'website/pricing.html',
    context: '</span> Timeboxed and standing work tracked separately</li>',
    anchor: 'Timeboxed and standing work tracked separately',
    href: '/standing-vs-timeboxed-work',
  },
  {
    file: 'website/pricing.html',
    context: '</span> Compliance against working days, not generated tasks</li>',
    anchor: 'Compliance against working days, not generated tasks',
    href: '/daily-work-tracking',
  },

  // ── / (homepage) ──
  {
    file: 'website/index.html',
    context: '<p class="rt-door-who">For founders, CEOs and managing directors of companies up to 500 people',
    anchor: 'For founders',
    href: '/for-founders',
  },
  {
    file: 'website/index.html',
    context: "<li>One line a day, read on the person's own day, the task and the manager rollup</li>",
    anchor: "One line a day, read on the person's own day, the task and the manager rollup",
    href: '/daily-work-tracking',
  },

  // ── blog: bill of quantities ──
  {
    file: 'blog/bill-of-quantities-vs-budget-line.html',
    context: 'It is the standard behaviour of a spreadsheet with a rate column and a formula,',
    anchor: 'a spreadsheet with a rate column and a formula',
    href: '/vs-spreadsheets',
  },
  {
    file: 'blog/bill-of-quantities-vs-budget-line.html',
    context: 'Most project tools cannot do this, not because it is difficult',
    anchor: 'Most project tools cannot do this',
    href: '/project-tracking-software-small-business',
  },

  // ── blog: when your tool generates work ──
  {
    file: 'blog/when-your-tool-generates-work.html',
    context: 'It is the resting state of an entire category of software,',
    anchor: 'the resting state of an entire category of software',
    href: '/why-you-stopped-knowing',
  },
  {
    file: 'blog/when-your-tool-generates-work.html',
    context: 'you get a straightforward measure: <strong>days recorded divided by working days</strong>',
    anchor: '<strong>days recorded divided by working days</strong>',
    href: '/daily-work-tracking',
  },

  // ── blog: the retainer at ninety per cent ──
  {
    file: 'blog/retainer-ninety-percent-complete.html',
    context: 'The retainer moves to a spreadsheet, the dashboard goes clean',
    anchor: 'The retainer moves to a spreadsheet',
    href: '/vs-spreadsheets',
  },
  {
    file: 'blog/retainer-ninety-percent-complete.html',
    context: 'attended on eighteen of the last twenty working days, say.',
    anchor: 'attended on eighteen of the last twenty working days',
    href: '/daily-work-tracking',
  },
];

/* ── titles used in markdown "Related reading" lists ───────────────────── */
// Phrased the way the existing markdown lists already name these pages.

const TITLES = {
  '/vs-spreadsheets': 'vs a shared spreadsheet',
  '/daily-work-tracking': 'Daily work tracking',
  '/standing-vs-timeboxed-work': 'Standing versus timeboxed work',
  '/project-tracking-software-small-business': 'Project tracking for small business',
  '/for-founders': 'GoWarm for founders',
  '/why-you-stopped-knowing': 'Why you stopped knowing what is happening',
  '/blog/when-your-tool-generates-work': 'When your tool generates work',
  '/blog/bill-of-quantities-vs-budget-line': 'Bill of quantities vs a budget line',
  '/blog/retainer-ninety-percent-complete': 'The retainer that was 90% complete for two years',
};

/* ── blog posts that must be in sitemap.xml ────────────────────────────── */

const SITEMAP_REQUIRED = [
  '/blog/when-your-tool-generates-work',
  '/blog/bill-of-quantities-vs-budget-line',
  '/blog/retainer-ninety-percent-complete',
];

/* ── helpers ───────────────────────────────────────────────────────────── */

const counts = { applied: 0, already: 0, problems: 0 };
const problems = [];
const changedFiles = new Set();

const files = new Map(); // relative path -> { original, text }

function load(rel) {
  if (!files.has(rel)) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) return null;
    const text = fs.readFileSync(abs, 'utf8');
    files.set(rel, { original: text, text });
  }
  return files.get(rel);
}

function occurrences(haystack, needle) {
  let n = 0;
  let i = haystack.indexOf(needle);
  while (i !== -1) {
    n++;
    i = haystack.indexOf(needle, i + needle.length);
  }
  return n;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function plain(s) {
  return s.replace(/<[^>]+>/g, '');
}

function short(s, n = 70) {
  const t = plain(s).replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1) + '…' : t;
}

function status(tag, file, detail) {
  console.log(`  ${tag.padEnd(10)} ${file.padEnd(52)} ${detail}`);
}

function problem(file, detail) {
  counts.problems++;
  problems.push(`${file}: ${detail}`);
  status('PROBLEM', file, detail);
}

function urlForFile(rel) {
  if (!rel.endsWith('.html')) return null;
  const base = path.basename(rel, '.html');
  if (rel.startsWith('website/')) return base === 'index' ? `${SITE}/` : `${SITE}/${base}`;
  if (rel.startsWith('blog/')) return base === 'index' ? `${SITE}/blog` : `${SITE}/blog/${base}`;
  return null;
}

/* ── pass 1: in-body links ─────────────────────────────────────────────── */

function passLinks() {
  console.log('\n1. LINKS');
  for (const L of LINKS) {
    const f = load(L.file);
    if (!f) {
      problem(L.file, 'file not found');
      continue;
    }

    const isBlog = L.file.startsWith('blog/');
    const linkHtml = isBlog
      ? `<a href="${L.href}">${L.anchor}</a>`
      : `<a href="${L.href}" style="${WEBSITE_LINK_STYLE}">${L.anchor}</a>`;

    // already applied? (matched loosely on href + anchor, so a later change to
    // the style string does not cause a second link to be wrapped around it)
    const appliedRe = new RegExp(`<a href="${escapeRegex(L.href)}"[^>]*>${escapeRegex(L.anchor)}</a>`);
    if (appliedRe.test(f.text)) {
      counts.already++;
      status('already', L.file, `→ ${L.href}`);
      continue;
    }

    if (occurrences(L.context, L.anchor) !== 1) {
      problem(L.file, `anchor must occur exactly once inside its context: "${short(L.anchor)}"`);
      continue;
    }

    const n = occurrences(f.text, L.context);
    if (n === 0) {
      problem(L.file, `NOT FOUND (copy may have changed): "${short(L.context)}"`);
      continue;
    }
    if (n > 1) {
      problem(L.file, `AMBIGUOUS, context occurs ${n} times: "${short(L.context)}"`);
      continue;
    }

    const at = f.text.indexOf(L.context);
    const bodyAt = f.text.indexOf('<body');
    if (bodyAt === -1 || at < bodyAt) {
      problem(L.file, `context is outside <body> (head, meta or JSON-LD): "${short(L.context)}"`);
      continue;
    }

    const before = L.context.slice(0, L.context.indexOf(L.anchor));
    if (before.lastIndexOf('<a ') > before.lastIndexOf('</a>')) {
      problem(L.file, `anchor is already inside another link: "${short(L.anchor)}"`);
      continue;
    }

    const newContext = L.context.replace(L.anchor, linkHtml);
    f.text = f.text.slice(0, at) + newContext + f.text.slice(at + L.context.length);
    changedFiles.add(L.file);
    counts.applied++;
    status(DRY ? 'would add' : 'added', L.file, `"${short(L.anchor, 48)}" → ${L.href}`);
  }
}

/* ── pass 2: markdown related reading ──────────────────────────────────── */

function passMarkdown() {
  console.log('\n2. MARKDOWN');
  const targetsByMd = new Map();
  for (const L of LINKS) {
    if (!L.file.startsWith('website/')) continue;
    const md = `markdown/${path.basename(L.file, '.html')}.md`;
    if (!targetsByMd.has(md)) targetsByMd.set(md, []);
    const list = targetsByMd.get(md);
    if (!list.includes(L.href)) list.push(L.href);
  }

  for (const [md, hrefs] of targetsByMd) {
    const f = load(md);
    if (!f) {
      status('skip', md, 'no markdown copy for this page');
      continue;
    }

    const eol = f.text.includes('\r\n') ? '\r\n' : '\n';
    const additions = [];
    for (const href of hrefs) {
      const htmlUrl = `${SITE}${href}`;
      const mdUrl = href.startsWith('/blog/') ? htmlUrl : `${htmlUrl}.md`;
      // present already, in either form? (".md" or ")" or whitespace must follow,
      // so /work does not count as present because /work-something exists)
      const presentRe = new RegExp(`${escapeRegex(htmlUrl)}(?:\\.md)?(?=[\\s)\\]]|$)`, 'm');
      if (presentRe.test(f.text)) {
        counts.already++;
        status('already', md, `→ ${href}`);
        continue;
      }
      additions.push(`- ${TITLES[href] || href}: ${mdUrl}`);
    }
    if (!additions.length) continue;

    const lines = f.text.split(eol);
    const headIdx = lines.findIndex((l) => /^##\s+Related reading\s*$/i.test(l));
    if (headIdx === -1) {
      // no list yet: append a new section at the end
      let text = f.text.replace(/\s+$/, '');
      text += `${eol}${eol}## Related reading${eol}${additions.join(eol)}${eol}`;
      f.text = text;
    } else {
      // insert after the last list item of that section
      let last = headIdx;
      for (let i = headIdx + 1; i < lines.length; i++) {
        if (/^#{1,6}\s/.test(lines[i])) break;
        if (/^\s*-\s/.test(lines[i])) last = i;
      }
      lines.splice(last + 1, 0, ...additions);
      f.text = lines.join(eol);
    }
    changedFiles.add(md);
    for (const a of additions) {
      counts.applied++;
      status(DRY ? 'would add' : 'added', md, a.replace(/^- /, ''));
    }
  }
}

/* ── pass 3: blog article link style ───────────────────────────────────── */

const BLOG_CSS_MARKER = '/* gw: visible links inside article bodies */';
const BLOG_CSS_RULE = [
  BLOG_CSS_MARKER,
  '.article-body p a,',
  '.article-body li a {',
  '  color: var(--rust);',
  '  text-decoration: underline;',
  '  text-underline-offset: 3px;',
  '}',
  '.article-body p a:hover,',
  '.article-body li a:hover { color: var(--rust-dark); }',
].join('\n');

function passBlogCss() {
  console.log('\n3. BLOG CSS');
  const rel = 'blog/style.css';
  const f = load(rel);
  if (!f) {
    problem(rel, 'file not found');
    return;
  }
  if (f.text.includes(BLOG_CSS_MARKER)) {
    counts.already++;
    status('already', rel, 'article-body link rule');
    return;
  }
  const eol = f.text.includes('\r\n') ? '\r\n' : '\n';
  const rule = BLOG_CSS_RULE.split('\n').join(eol);

  // place it straight after the .article-body strong { … } block if present
  const m = f.text.match(/\.article-body strong\s*\{[^}]*\}/);
  if (m) {
    const at = m.index + m[0].length;
    f.text = f.text.slice(0, at) + eol + rule + f.text.slice(at);
  } else {
    f.text = f.text.replace(/\s*$/, '') + eol + eol + rule + eol;
  }
  changedFiles.add(rel);
  counts.applied++;
  status(DRY ? 'would add' : 'added', rel, 'article-body link rule');
}

/* ── pass 4: sitemap ───────────────────────────────────────────────────── */

function passSitemap() {
  console.log('\n4. SITEMAP');
  const rel = 'sitemap.xml';
  const f = load(rel);
  if (!f) {
    problem(rel, 'file not found');
    return;
  }
  const eol = f.text.includes('\r\n') ? '\r\n' : '\n';
  let touched = false;

  // 4a. missing Work blog posts
  for (const p of SITEMAP_REQUIRED) {
    const loc = `<loc>${SITE}${p}</loc>`;
    if (f.text.includes(loc)) {
      counts.already++;
      status('already', rel, p);
      continue;
    }
    const entry = `  <url>${loc}<lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
    // after the last existing /blog/ entry, else before </urlset>
    const blogLines = [...f.text.matchAll(/^.*<loc>https:\/\/gowarmcrm\.com\/blog\/[^<]*<\/loc>.*$/gm)];
    if (blogLines.length) {
      const lastLine = blogLines[blogLines.length - 1];
      const at = lastLine.index + lastLine[0].length;
      f.text = f.text.slice(0, at) + eol + entry + f.text.slice(at);
    } else {
      f.text = f.text.replace('</urlset>', `${entry}${eol}</urlset>`);
    }
    touched = true;
    counts.applied++;
    status(DRY ? 'would add' : 'added', rel, p);
  }

  // 4b. lastmod for pages changed in this run
  for (const file of changedFiles) {
    const url = urlForFile(file);
    if (!url) continue;
    const re = new RegExp(`(<loc>${escapeRegex(url)}</loc>\\s*<lastmod>)([^<]*)(</lastmod>)`);
    const m = f.text.match(re);
    if (!m) {
      status('note', rel, `no entry for ${url.replace(SITE, '') || '/'}, lastmod not set`);
      continue;
    }
    if (m[2] === TODAY) continue;
    f.text = f.text.replace(re, `$1${TODAY}$3`);
    touched = true;
    status(DRY ? 'would set' : 'set', rel, `lastmod ${TODAY}  ${url.replace(SITE, '') || '/'}`);
  }

  if (touched) changedFiles.add(rel);
}

/* ── run ───────────────────────────────────────────────────────────────── */

console.log(`\n[apply-work-links] root  ${ROOT}`);
console.log(`[apply-work-links] mode  ${DRY ? 'DRY RUN — nothing will be written' : 'APPLY'}`);

passLinks();
passMarkdown();
passBlogCss();
passSitemap();

if (!DRY) {
  for (const [rel, f] of files) {
    if (f.text !== f.original) fs.writeFileSync(path.join(ROOT, rel), f.text, 'utf8');
  }
}

const changedUrls = [...changedFiles].map(urlForFile).filter(Boolean).map((u) => u.replace(SITE, '') || '/');

console.log('\n── summary ──');
console.log(`  ${(DRY ? 'would apply' : 'applied').padEnd(12)} ${counts.applied}`);
console.log(`  ${'already'.padEnd(12)} ${counts.already}`);
console.log(`  ${'problems'.padEnd(12)} ${counts.problems}`);
if (changedFiles.size) {
  console.log(`\n  files ${DRY ? 'that would change' : 'changed'}:`);
  [...changedFiles].sort().forEach((f) => console.log(`    ${f}`));
}
if (problems.length) {
  console.log(`\n  problems (these were skipped; everything else ${DRY ? 'would be' : 'was'} applied):`);
  problems.forEach((p) => console.log(`    ${p}`));
}
if (changedUrls.length) {
  console.log(`\n  after deploying, submit the changed pages:`);
  console.log(`    node scripts/submit-indexnow.js ${changedUrls.join(' ')}`);
}
if (DRY && counts.applied) console.log('\n  Re-run without --dry-run to write these changes.');
console.log('');

process.exit(counts.problems ? 1 : 0);
