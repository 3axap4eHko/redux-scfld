import Fs from 'fs';
import Path from 'path';
import { template } from 'lodash';
import { loadedConfig as config } from './config';
import { mkDir } from './utils';
import templateOptions from './template-options';

export function createReducer(entity, options) {
  const reducerTemplate = template(Fs.readFileSync(config.reducerTemplatePath), templateOptions);
  mkDir(config.reducersPath);
  if (!Fs.existsSync(entity.reducerPath) || options.force) {
    const content = reducerTemplate({ entity });
    Fs.writeFileSync(entity.reducerPath, content);
  }
}
export function generateReducersIndex(entities) {
  const indexTemplate = template(
    Fs.readFileSync(config.reducersIndexTemplatePath), templateOptions);
  mkDir(config.reducersPath);
  const content = indexTemplate({ entities });
  Fs.writeFileSync(Path.join(config.reducersPath, 'index.js'), content);
}
