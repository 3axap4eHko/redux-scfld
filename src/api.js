import Fs from 'fs';
import { resolve, join, basename, relative } from 'path';
import Glob from 'glob';
import Del from 'del';
import { createAction, generateActionsIndex } from './action';
import generateTypes from './types';
import { createReducer, generateReducersIndex } from './reducer';
import { createState, generateStatesIndex } from './state';
import { parseName, getEntity, getEntities, eachEntity, mkDir } from './utils';
import { defaultConfig, loadedConfig } from './config';

export function init(templates) {
  const baseConfig = {
    useCamelCasedPaths: false,
    actionsPath: './app/actions',
    reducersPath: './app/reducers',
    typesPath: './app/types',
    statesPath: './app/states',
  };
  if (templates) {
    Fs.writeFileSync('.reduxrc', JSON.stringify({ ...defaultConfig, ...baseConfig }, null, '  '));
  } else {
    Fs.writeFileSync('.reduxrc', JSON.stringify(baseConfig, null, '  '));
  }
}

export function add(entityNames, options) {
  entityNames.forEach((entityName) => {
    const entity = getEntity(entityName);
    createAction(entity, options);
    console.log(`[Redux] Action created: ${entity.fullName}`);
    createReducer(entity, options);
    console.log(`[Redux] Reducer created: ${entity.fullName}`);
    createState(entity, options);
    console.log(`[Redux] State created: ${entity.namespace}`);
  });
  const entities = getEntities();
  generateActionsIndex(entities);
  console.log('[Redux] Actions index regenerated');
  generateTypes(entities, options);
  console.log('[Redux] Types index regenerated');
  generateReducersIndex(entities);
  console.log('[Redux] Reducers index regenerated');
  generateStatesIndex(entities);
  console.log('[Redux] States index regenerated');
}

export function del(entityNames, options) {
  entityNames.forEach((entityName) => {
    const entity = getEntity(parseName(`${entityName}:*`).join(':'));
    if (/\*/.test(entity.filename)) {
      Del.sync(entity.actionFolder);
    } else {
      Del.sync(entity.actionPath);
    }
    Del.sync(entity.reducerPath);
    Del.sync(entity.statePath);
    console.log(`[Redux] Entity ${entityName} deleted`);
  });
  const entities = getEntities();
  generateActionsIndex(entities);
  console.log('[Redux] Actions index regenerated');
  generateTypes(entities, options);
  console.log('[Redux] Types index regenerated');
  generateReducersIndex(entities);
  console.log('[Redux] Reducers index regenerated');
  generateStatesIndex(entities);
  console.log('[Redux] States index regenerated');
}

export function config() {
  console.log(JSON.stringify(loadedConfig, null, '  '));
}

export function gen() {
  const entities = getEntities();
  generateActionsIndex(entities);
  console.log('[Redux] Actions index generated');
  generateTypes(entities);
  console.log('[Redux] Types index generated');
  generateReducersIndex(entities);
  console.log('[Redux] Reducers index generated');
  generateStatesIndex(entities);
  console.log('[Redux] States index generated');
}

export function list() {
  const entities = getEntities();
  eachEntity(entities, entity => console.log(`${entity.fullName}`));
}

export function namespaces() {
  const entities = getEntities();
  Object.keys(entities).forEach(namespace => console.log(`${namespace}`));
}

export function types() {
  const entities = getEntities();
  eachEntity(entities, entity => console.log(`${entity.TYPE}`));
}

export function template(dir) {
  const targetDir = relative(process.cwd(), resolve(process.cwd(), dir));
  mkDir(targetDir);
  Glob.sync(join(__dirname, 'templates/*.jst')).forEach((filepath) => {
    const filename = join(targetDir, basename(filepath));
    Fs.createReadStream(filepath)
      .pipe(Fs.createWriteStream(filename));
  });
}
