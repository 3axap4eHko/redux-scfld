import Path from 'path';
import { compile } from './template';
import { loadedConfig as config } from './config';
import { mkDir, write } from './utils';

export async function generateStoreCreator() {
  const indexTemplate = await compile(config.storeTemplatePath);
  await mkDir(config.reduxPath);
  const content = indexTemplate();
  await write(Path.join(config.reduxPath, 'createStore.js'), content);
}
