#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const getData = require('./get-data');
const openCodePen = require('./open-codepen');

let { inputFileName, inputOption } = getInputArgs();

if (typeof inputFileName === 'undefined') {
  help();
  exit();
}

const source = path.join(process.cwd(), inputFileName);
const extname = path.extname(source).substr(1);

let sourceContent = '';
try {
  sourceContent = fs.readFileSync(source, 'utf8');
} catch (error) {
  let message = error.message;
  if (error.code == 'ENOENT') {
    message = `Can not open '${ inputFileName }'.`
  }
  exit(message);
}

const { data, error } = getData(sourceContent, {
  extname,
  keepInline: inputOption === '--keep-inline'
});

if (error) {
  exit(error.message);
}

openCodePen(data, error => {
  if (error) {
    exit(error.message);
  }
});

function getInputArgs() {
  let input = process.argv.slice(2);
  return {
    inputFileName: input.find(n => !n.startsWith('--')),
    inputOption: input.find(n => n.startsWith('--')),
  }
}

function help() {
  console.log(`
Usage:
  codepen <filename>

Options:
  --keep-inline: Keep inline styles/scripts inside html
  --help:        Display help info

Supported filename types by extension:
  htm, html, md, markdown, js, ts, css, less, sass, scss, styl
  `);
}

function exit(message) {
  if (message) {
    console.error('\n', message);
  }
  process.exit(1);
}
