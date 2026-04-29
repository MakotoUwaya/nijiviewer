#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';

const root = resolve(fileURLToPath(import.meta.url), '..', '..');
const apps = ['nijiviewer', 'voice-generator', 'sync-board'];

const coverageMap = libCoverage.createCoverageMap({});

let mergedCount = 0;
for (const app of apps) {
  const file = resolve(root, 'apps', app, 'coverage', 'coverage-final.json');
  if (!existsSync(file)) {
    console.warn(`[merge-coverage] Skip: ${file} not found`);
    continue;
  }
  const data = JSON.parse(readFileSync(file, 'utf8'));
  coverageMap.merge(data);
  mergedCount += 1;
  console.log(`[merge-coverage] Merged: ${file}`);
}

if (mergedCount === 0) {
  console.error('[merge-coverage] No coverage-final.json files found.');
  process.exit(1);
}

const outDir = resolve(root, 'coverage');
mkdirSync(outDir, { recursive: true });

const context = libReport.createContext({
  dir: outDir,
  coverageMap,
  defaultSummarizer: 'nested',
});

for (const reporter of ['html', 'text', 'text-summary', 'lcov', 'json-summary']) {
  reports.create(reporter).execute(context);
}

console.log(`\n[merge-coverage] Merged report written to: ${outDir}`);
