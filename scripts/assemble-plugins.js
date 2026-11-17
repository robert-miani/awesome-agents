#!/usr/bin/env node
/**
 * Assembles skills into plugins per plugins/plugin-config.json.
 *
 * For every skill entry with "source": "assembly", copies
 *   skills/<from>/  →  plugins/<name>/skills/<skill-name>/
 * and writes a .assembled marker (containing the source path) so generated
 * copies are clearly distinguishable from hand-authored local skills.
 *
 * Safe to re-run: skips entries already in sync with their source.
 * Missing source skills (not yet authored) are warned but do not block.
 * IO errors exit 1 and block the pre-commit hook.
 */

const fs   = require('fs');
const path = require('path');

const ROOT   = path.resolve(__dirname, '..');
const CONFIG = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'plugins', 'plugin-config.json'), 'utf8')
);

function listFiles(dir, base, skip = new Set()) {
  base = base ?? dir;
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(full, base, skip));
    else out.push(path.relative(base, full));
  }
  return out.sort();
}

function inSync(src, dest) {
  if (!fs.existsSync(dest)) return false;
  const srcFiles  = listFiles(src);
  const destFiles = listFiles(dest, dest, new Set(['.assembled']));
  if (srcFiles.length !== destFiles.length) return false;
  for (let i = 0; i < srcFiles.length; i++) {
    if (srcFiles[i] !== destFiles[i]) return false;
    const a = fs.readFileSync(path.join(src,  srcFiles[i]));
    const b = fs.readFileSync(path.join(dest, destFiles[i]));
    if (!a.equals(b)) return false;
  }
  return true;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

let copied = 0, skipped = 0, missing = 0;
const ioErrors = [];

for (const plugin of CONFIG.plugins) {
  for (const skill of plugin.skills) {
    if (skill.source !== 'assembly') continue;

    const src  = path.join(ROOT, 'skills', skill.from);
    const dest = path.join(ROOT, 'plugins', plugin.name, 'skills', skill.name);

    if (!fs.existsSync(src)) {
      console.warn(`  ? skills/${skill.from} not yet authored — skipping ${plugin.name}/${skill.name}`);
      missing++;
      continue;
    }

    if (inSync(src, dest)) { skipped++; continue; }

    try {
      if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
      copyDir(src, dest);
      fs.writeFileSync(path.join(dest, '.assembled'), `${skill.from}\n`);
      console.log(`  + plugins/${plugin.name}/skills/${skill.name}  <-  skills/${skill.from}`);
      copied++;
    } catch (err) {
      ioErrors.push(`  plugins/${plugin.name}/${skill.name}: ${err.message}`);
    }
  }
}

const summary = [`${copied} updated`, `${skipped} unchanged`];
if (missing)       summary.push(`${missing} not yet authored`);
if (ioErrors.length) summary.push(`${ioErrors.length} errors`);
console.log(`\nAssembly: ${summary.join(', ')}.`);

if (ioErrors.length) {
  console.error('\nIO errors (assembly blocked):');
  ioErrors.forEach(e => console.error(e));
  process.exit(1);
}
