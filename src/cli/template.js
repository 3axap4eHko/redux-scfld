import doT from 'dot';
import Fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
import templateOptions from './template-options';

const accessAsync = promisify(Fs.access);
const readFileAsync = promisify(Fs.readFile);

const map = new Map();

async function getTemplateCode(filename) {
  if (!map.has(filename)) {
    const content = await readFileAsync(filename, 'utf-8');
    map.set(filename, doT.template(content, { ...doT.templateSettings, strip: false }));
  }
  return map.get(filename);
}

export async function compile(path) {
  const filename = resolve(path);
  await accessAsync(filename);
  const template = await getTemplateCode(filename);
  return scope => template({ ...templateOptions, ...scope });
}
