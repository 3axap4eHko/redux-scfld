import Fs from 'fs';
import { join, resolve, configFile } from './utils';

export function getBaseConfig(folder) {
  return {
    useCamelCasedPaths: false,
    reduxPath: folder,
    actionsPath: join(folder, 'actions'),
    typesPath: join(folder, 'types'),
    statesPath: join(folder, 'states'),
  };
}

export function getAdvancedConfig(folder) {
  return {
    ...getBaseConfig(folder),
    storeTemplatePath: join(folder, 'templates', 'store.dot'),
    actionTemplatePath: join(folder, 'templates', 'action.dot'),
    actionsIndexTemplatePath: join(folder, 'templates', 'action-index.dot'),
    typesTemplatePath: join(folder, 'templates', 'types.dot'),
    stateTemplatePath: join(folder, 'templates', 'state.dot'),
    statesIndexTemplatePath: join(folder, 'templates', 'state-index.dot'),
  };
}

export const defaultConfig = Object.freeze(getAdvancedConfig(resolve(__dirname, '../')));

export const loadedConfig = Object.freeze(Object.assign({}, defaultConfig, Fs.existsSync(configFile) ? JSON.parse(Fs.readFileSync(configFile, 'utf8')) : {}));
