const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if(file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
const keysInCode = new Set();
const defaultValues = {};

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // match t('key') or t("key") or t('key', 'default')
  // We'll use a simpler regex for now
  const regex = /t\(['"]([^'"]+)['"](?:,\s*['"]([^'"]+)['"])?\)/g;
  let match;
  while((match = regex.exec(content)) !== null) {
    keysInCode.add(match[1]);
    if (match[2]) {
        defaultValues[match[1]] = match[2];
    }
  }
});

const hiJsonPath = './src/locales/hi.json';
const enJsonPath = './src/locales/en.json';

const hiData = JSON.parse(fs.readFileSync(hiJsonPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((o, k) => (o || {})[k], obj);
}

function setNestedValue(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

const missingInHi = [];
keysInCode.forEach(key => {
  const val = getNestedValue(hiData, key);
  if (val === undefined) {
    missingInHi.push(key);
  }
});

console.log("Missing keys in hi.json:");
missingInHi.forEach(k => {
    let fallback = getNestedValue(enData, k) || defaultValues[k] || '';
    console.log(`${k} -> ${fallback}`);
});
