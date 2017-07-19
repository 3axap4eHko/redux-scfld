import Fs from 'fs';
import Path from 'path';
import { template } from 'lodash';

import { loadedConfig as config } from './config';
import { mkDir } from './utils';
import templateOptions from './template-options';


export function createAction(entity, options) {
  const actionTemplate = template(Fs.readFileSync(config.actionTemplatePath), templateOptions);
  mkDir(entity.actionFolder);
  if (Fs.existsSync(entity.actionPath) && !options.force) {
    throw new Error(`Action '${entity.fullName}' already exists`);
  }
  const content = actionTemplate(entity);
  Fs.writeFileSync(entity.actionPath, content);
}

export function generateActionsIndex(entities) {
  const indexTemplate = template(Fs.readFileSync(config.actionsIndexTemplatePath), templateOptions);
  mkDir(config.actionsPath);
  const content = indexTemplate({ entities });
  Fs.writeFileSync(Path.join(config.actionsPath, 'index.js'), content);
  return entities;
}
