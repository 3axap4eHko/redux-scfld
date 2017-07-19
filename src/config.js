import Fs from 'fs';
import { join, exists, configFile } from './utils';

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
    actionTemplatePath: join(folder, 'templates', 'action.jst'),
    actionsIndexTemplatePath: join(folder, 'templates', 'action-index.jst'),
    reducerTemplatePath: join(folder, 'templates', 'reducer.jst'),
    reducersIndexTemplatePath: join(folder, 'templates', 'reducer-index.jst'),
    typesTemplatePath: join(folder, 'templates', 'types.jst'),
    stateTemplatePath: join(folder, 'templates', 'state.jst'),
    statesIndexTemplatePath: join(folder, 'templates', 'state-index.jst'),
  };
}

export const defaultConfig = Object.freeze(getAdvancedConfig(__dirname));

export const loadedConfig = Object.freeze(Object.assign({}, defaultConfig, exists(configFile) ? JSON.parse(Fs.readFileSync(configFile, 'utf8')) : {}));
