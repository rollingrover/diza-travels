#!/usr/bin/env node
/**
 * verify-locale-parity.js
 * ─────────────────────────────────────────────────────────────────────────
 * Walks every messages/{locale}.json file and confirms it has EXACTLY the
 * same set of keys (at every nesting level) as messages/en.json.
 *
 * Run after a translator hands back a file, or after adding new strings,
 * to catch missing/extra keys before they cause a runtime error in
 * next-intl (which throws if a key is requested but missing).
 *
 * Usage:  node scripts/verify-locale-parity.js
 * Exit code 0 = all good. Exit code 1 = mismatch found (prints details).
 * ─────────────────────────────────────────────────────────────────────────
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const LOCALES = ['en', 'zu', 'zh', 'ru', 'hi', 'pt', 'es', 'nl', 'de', 'fr'];

/** Recursively collect every dotted key path, e.g. "Home.heroBody" */
function collectKeyPaths(obj, prefix = '') {
  let paths = [];
  for (const key of Object.keys(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      paths = paths.concat(collectKeyPaths(obj[key], fullPath));
    } else {
      paths.push(fullPath);
    }
  }
  return paths;
}

function loadJson(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: messages/${locale}.json`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function main() {
  const enData = loadJson('en');
  const enKeys = new Set(collectKeyPaths(enData));

  let hasErrors = false;

  console.log(`📋 English (en.json) has ${enKeys.size} keys. Checking 9 other locales...\n`);

  for (const locale of LOCALES) {
    if (locale === 'en') continue;

    const data = loadJson(locale);
    const keys = new Set(collectKeyPaths(data));

    const missing = [...enKeys].filter(k => !keys.has(k));
    const extra = [...keys].filter(k => !enKeys.has(k));

    if (missing.length === 0 && extra.length === 0) {
      console.log(`✅ ${locale}.json — ${keys.size} keys — parity OK`);
    } else {
      hasErrors = true;
      console.log(`❌ ${locale}.json — MISMATCH`);
      if (missing.length) {
        console.log(`   Missing ${missing.length} key(s):`);
        missing.forEach(k => console.log(`     - ${k}`));
      }
      if (extra.length) {
        console.log(`   Extra ${extra.length} key(s) (not in en.json):`);
        extra.forEach(k => console.log(`     + ${k}`));
      }
    }
  }

  console.log('');
  if (hasErrors) {
    console.error('❌ Locale parity check FAILED. Fix the mismatches above before deploying.');
    process.exit(1);
  } else {
    console.log('✅ All 10 locale files are in perfect structural parity.');
    process.exit(0);
  }
}

main();
