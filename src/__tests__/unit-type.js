import { resolve } from 'path';
import createTypes from '../cli/types';
import { globRelative, getEntity } from '../cli/utils';

const tmpDir = resolve(__dirname + '/../../tmp/types');

const entityList = [
  getEntity('app:load'),
  getEntity('app:reset'),
  getEntity('config:load'),
  getEntity('config:save'),
  getEntity('user:login'),
];

test('Types create', async () => {
  const entities = {};
  entityList.forEach(entity => {
    if (!entities[entity.namespace]) {
      entities[entity.namespace] = {};
    }
    entities[entity.namespace][entity.name] = entity;
  });
  await createTypes(entities);
  const files = await globRelative(tmpDir, `${tmpDir}/**/*.js`);
  expect(files).toContain('index.js');
  const types = require(`${tmpDir}/index.js`);

  expect(types).toHaveProperty('STATUS_PROCESS');
  expect(types.STATUS_PROCESS).toBe('STATUS_PROCESS');

  expect(types).toHaveProperty('STATUS_SUCCESS');
  expect(types.STATUS_SUCCESS).toBe('STATUS_SUCCESS');

  expect(types).toHaveProperty('STATUS_FAILURE');
  expect(types.STATUS_FAILURE).toBe('STATUS_FAILURE');

  expect(types).toHaveProperty('NAMESPACE_APP');
  expect(types.NAMESPACE_APP).toBe('app');

  expect(types).toHaveProperty('NAMESPACE_CONFIG');
  expect(types.NAMESPACE_CONFIG).toBe('config');

  expect(types).toHaveProperty('NAMESPACE_USER');
  expect(types.NAMESPACE_USER).toBe('user');

  expect(types).toHaveProperty('NAMESPACES');
  expect(types.NAMESPACES).toContain('app');
  expect(types.NAMESPACES).toContain('config');
  expect(types.NAMESPACES).toContain('user');

  expect(types.APP_LOAD).toBe('APP_LOAD');
  expect(types.APP_RESET).toBe('APP_RESET');
  expect(types.CONFIG_LOAD).toBe('CONFIG_LOAD');
  expect(types.CONFIG_SAVE).toBe('CONFIG_SAVE');
  expect(types.USER_LOGIN).toBe('USER_LOGIN');
});

