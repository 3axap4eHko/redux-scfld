import Fs from 'fs';
import Path from 'path';
import { template } from 'lodash';

import { loadedConfig as config } from './config';
import { mkDir } from './utils';
import templateOptions  from './template-options';

const stateTemplate = template(Fs.readFileSync(config.stateTemplatePath), templateOptions);
const indexTemplate = template(Fs.readFileSync(config.statesIndexTemplatePath), templateOptions);

export function createState(entity) {
  mkDir(config.statesPath);
  if (!Fs.existsSync(entity.statePath)) {
    const content = stateTemplate(entity);
    Fs.writeFileSync(entity.statePath, content);
  }
}

export function generateStatesIndex(entities) {
  mkDir(config.statesPath);
  const content = indexTemplate({ entities });
  Fs.writeFileSync(Path.join(config.statesPath, 'index.js'), content);
  return entities;
}