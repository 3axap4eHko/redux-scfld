import Path from 'path';
import { compile } from './template';
import { loadedConfig as config } from './config';
import { mkDir, write } from './utils';

export default async function types(entities) {
  const typesTemplate = await compile(config.typesTemplatePath);
  await mkDir(config.typesPath);
  const content = typesTemplate({ entities });
  await write(Path.join(config.typesPath, 'index.js'), content);
}
