/**
 * Plattformunabhaengiger Starter fuer analyzeGroupRegime.ts.
 *
 * Das Werkzeug liegt ausserhalb von backend/ und frontend/, hat also keine
 * eigenen Abhaengigkeiten. Es benutzt die des Backends (ts-node,
 * better-sqlite3) — deshalb wird backend/node_modules vor dem Laden in den
 * Modulsuchpfad aufgenommen. Die tsconfig dieses Werkzeugs macht backend/,
 * frontend/ und shared/ gemeinsam sichtbar.
 */
const path = require('node:path');
const Module = require('node:module');

const toolDir = __dirname;
const repoRoot = path.join(toolDir, '..', '..');
const backendModules = path.join(repoRoot, 'backend', 'node_modules');

process.env.NODE_PATH = process.env.NODE_PATH
  ? `${backendModules}${path.delimiter}${process.env.NODE_PATH}`
  : backendModules;
Module._initPaths();

process.env.TS_NODE_PROJECT = path.join(toolDir, 'tsconfig.json');
// Der Referenzlauf laeuft nur; die Typen pruefen wir separat mit
//   backend/node_modules/.bin/tsc -p tools/quicksim-calibration/tsconfig.json
process.env.TS_NODE_TRANSPILE_ONLY = process.env.TS_NODE_TRANSPILE_ONLY ?? 'true';

require(path.join(backendModules, 'ts-node', 'register'));
require(path.join(toolDir, 'analyzeGroupRegime.ts'));
