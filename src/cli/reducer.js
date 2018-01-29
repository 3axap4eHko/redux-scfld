import Path from 'path';
import { compile } from './template';
import { loadedConfig as config } from './config';
import { mkDir, exists, write } from './utils';

export async function createReducer(entity, options) {
  if (await exists(entity.reducersPath) && !options.force) {
    throw new Error(`Reducer '${entity.fullName}' already exists`);
  }
  const reducerTemplate = await compile(config.reducerTemplatePath);
  await mkDir(config.reducersPath);
  const content = reducerTemplate({ entity });
  await write(entity.reducerPath, content);
  return entity;
}

export async function generateReducersIndex(entities) {
  const indexTemplate = await compile(config.reducersIndexTemplatePath);
  await mkDir(config.reducersPath);
  const content = indexTemplate({ entities });
  await write(Path.join(config.reducersPath, 'index.js'), content);
  return entities;
}
