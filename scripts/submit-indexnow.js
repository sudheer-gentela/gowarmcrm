#!/usr/bin/env node
/**
 * submit-indexnow.js — push changed URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 *
 *   node scripts/submit-indexnow.js --all          every URL in sitemap.xml
 *   node scripts/submit-indexnow.js /work /sales   just these paths
 *   node scripts/submit-indexnow.js --all --dry-run
 *
 * Google does not participate in IndexNow — this complements Search Console,
 * it does not replace it. The sitemap ping endpoints at both Google and Bing
 * are dead, so this is the only remaining programmatic submission route.
 *
 * The key file must be live at https://gowarmcrm.com/<key>.txt before this
 * will be accepted. The key is not a secret; it proves domain ownership only.
 */
'use strict';
const fs = require('fs'), path = require('path'), https = require('https');

const HOST = 'gowarmcrm.com';
const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry-run');
const ALL = process.argv.includes('--all');
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));

// the key is whichever <key>.txt sits at the repo root
const keyFile = fs.readdirSync(ROOT).find(f => /^[0-9a-f]{16,64}\.txt$/.test(f));
if (!keyFile) {
  console.error('No IndexNow key file found at the repo root (expected <key>.txt).');
  process.exit(2);
}
const key = path.basename(keyFile, '.txt');

let urls;
if (ALL) {
  const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
} else if (args.length) {
  urls = args.map(a => a.startsWith('http') ? a : `https://${HOST}${a.startsWith('/') ? a : '/' + a}`);
} else {
  console.error('Pass --all, or one or more paths. Nothing submitted.');
  process.exit(2);
}
if (urls.length > 10000) { console.error('IndexNow accepts at most 10,000 URLs per request.'); process.exit(2); }

const body = JSON.stringify({
  host: HOST, key,
  keyLocation: `https://${HOST}/${key}.txt`,
  urlList: urls,
});

console.log(`\n[indexnow] key      ${key}`);
console.log(`[indexnow] urls     ${urls.length}`);
console.log(`[indexnow] mode     ${DRY ? 'DRY RUN — nothing sent' : 'SUBMIT'}\n`);
urls.slice(0, 10).forEach(u => console.log('  ' + u));
if (urls.length > 10) console.log(`  … and ${urls.length - 10} more`);

if (DRY) { console.log('\n[indexnow] Re-run without --dry-run to submit.\n'); process.exit(0); }

const req = https.request({
  hostname: 'api.indexnow.org', path: '/IndexNow', method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) },
}, res => {
  let out = '';
  res.on('data', d => out += d);
  res.on('end', () => {
    // 200 accepted · 202 accepted, key validation pending · 400 bad request
    // 403 key not valid · 422 URLs do not match host · 429 too many requests
    console.log(`\n[indexnow] HTTP ${res.statusCode}${out ? ' — ' + out.trim() : ''}`);
    if (res.statusCode === 200 || res.statusCode === 202) console.log('[indexnow] Accepted.\n');
    else if (res.statusCode === 403) console.log('[indexnow] Key rejected — is the key file live at the root yet?\n');
    else console.log('[indexnow] Not accepted. See status code above.\n');
    process.exit(res.statusCode < 300 ? 0 : 1);
  });
});
req.on('error', e => { console.error('[indexnow] request failed:', e.message); process.exit(1); });
req.write(body); req.end();
