import { join, basename, relative } from 'path';
import { createAction, generateActionsIndex } from './action';
import generateTypes from './types';
import { createReducer, generateReducersIndex } from './reducer';
import { createState, generateStatesIndex } from './state';
import { parseName, getEntity, getEntities, flatEntities, eachEntity, mkDir, write, rm, glob, copy } from './utils';
import { loadedConfig, getBaseConfig, getAdvancedConfig } from './config';

export async function sync() {
  const entities = await getEntities();
  console.log('[Redux] Sync indexes');
  await generateActionsIndex(entities);
  console.log('[Redux] Actions index generated');
  await generateTypes(entities);
  console.log('[Redux] Types index generated');
  await generateReducersIndex(entities);
  console.log('[Redux] Reducers index generated');
  await generateStatesIndex(entities);
  console.log('[Redux] States index generated');
}

export async function add(entityNames, options) {
  for (const entityName of entityNames) {
    const entity = getEntity(entityName);
    await createAction(entity, options);
    console.log(`[Redux] Action created: ${entity.fullName}`);
    await createReducer(entity, options);
    console.log(`[Redux] Reducer created: ${entity.fullName}`);
    await createState(entity, options);
    console.log(`[Redux] State created: ${entity.namespace}`);
  }
  await sync();
}

export async function del(entityNames, options) {

  for (const entityName of entityNames) {
    const entity = getEntity(parseName(`${entityName}:*`).join(':'));
    if (/\*/.test(entity.filename)) {
      await rm(entity.actionFolder);
      await rm(entity.reducerPath);
      await rm(entity.statePath);
    } else {
      await rm(entity.actionPath);
      const entities = flatEntities(await getEntities());
      const isNamespaceExists = entities.some(e => e.NAMESPACE === entity.NAMESPACE);
      if (!isNamespaceExists) {
        await rm(entity.reducerPath);
        await rm(entity.statePath);
      }
    }
    console.log(`[Redux] Entity ${entityName} deleted`);
  }

  await sync();
}

export function config() {
  console.log(JSON.stringify(loadedConfig, null, '  '));
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

export async function copyTemplatesTo(dir) {
  await mkDir(dir);
  const files = await glob(join(__dirname, '../templates/*.jst'));
  for (const path of files) {
    const filename = join(dir, basename(path));
    await copy(path, filename);
  }
}

export async function init(path) {
  if (path) {
    const dir = `./${relative(process.cwd(), path)}`;
    await write('.reduxrc', JSON.stringify(getAdvancedConfig(dir), null, '  '));
    await copyTemplatesTo(join(dir, 'templates'));
  } else {
    await write('.reduxrc', JSON.stringify(getBaseConfig('./app/redux'), null, '  '));
  }
}

