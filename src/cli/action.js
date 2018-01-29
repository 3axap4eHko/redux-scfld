import Path from 'path';
import { compile } from './template';

import { loadedConfig as config } from './config';
import { mkDir, exists, write } from './utils';

export async function createAction(entity, options) {
  if (await exists(entity.actionPath) && !options.force) {
    throw new Error(`Action '${entity.fullName}' already exists`);
  }
  const actionTemplate = await compile(config.actionTemplatePath);
  await mkDir(entity.actionFolder);
  const content = actionTemplate(entity);
  await write(entity.actionPath, content);
  return entity;
}

export async function generateActionsIndex(entities) {
  const indexTemplate = await compile(config.actionsIndexTemplatePath);
  await mkDir(config.actionsPath);
  const content = indexTemplate({ entities });
  await write(Path.join(config.actionsPath, 'index.js'), content);
  return entities;
}
