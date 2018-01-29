import Fs from 'fs';
import { join, configFile } from './utils';

export function getBaseConfig(folder) {
  return {
    useCamelCasedPaths: false,
    actionsPath: join(folder, 'actions'),
    reducersPath: join(folder, 'reducers'),
    typesPath: join(folder, 'types'),
    statesPath: join(folder, 'states'),
  };
}

export function getAdvancedConfig(folder) {
  return {
    ...getBaseConfig(folder),
    actionTemplatePath: join(folder, 'templates', 'action.dot'),
    actionsIndexTemplatePath: join(folder, 'templates', 'action-index.dot'),
    reducerTemplatePath: join(folder, 'templates', 'reducer.dot'),
    reducersIndexTemplatePath: join(folder, 'templates', 'reducer-index.dot'),
    typesTemplatePath: join(folder, 'templates', 'types.dot'),
    stateTemplatePath: join(folder, 'templates', 'state.dot'),
    statesIndexTemplatePath: join(folder, 'templates', 'state-index.dot'),
  };
}

export const defaultConfig = Object.freeze(getAdvancedConfig(__dirname));

export const loadedConfig = Object.freeze(Object.assign({}, defaultConfig, Fs.existsSync(configFile) ? JSON.parse(Fs.readFileSync(configFile, 'utf8')) : {}));
