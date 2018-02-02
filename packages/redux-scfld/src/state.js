import Path from 'path';
import { compile } from './template';

import { loadedConfig as config } from './config';
import { mkDir, exists, write } from './utils';

export async function createState(entity) {
  const stateTemplate = await compile(config.stateTemplatePath);
  await mkDir(config.statesPath);
  if (!await exists(entity.statePath)) {
    const content = stateTemplate(entity);
    await write(entity.statePath, content);
  }
}

export async function generateStatesIndex(entities) {
  const indexTemplate = await compile(config.statesIndexTemplatePath);
  await mkDir(config.statesPath);
  const content = indexTemplate({ entities });
  await write(Path.join(config.statesPath, 'index.js'), content);
  return entities;
}
