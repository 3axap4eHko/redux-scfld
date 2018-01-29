import { resolve } from 'path';
import { createAction, generateActionsIndex } from '../cli/action';
import { globRelative, getEntity, getEntities } from '../cli/utils';

const tmpDir = resolve(__dirname + '/../../tmp/actions');

test('Action create', async () => {
  const entity = getEntity('app:load');
  await createAction(entity, { force: true });
  const files = await globRelative(tmpDir, `${tmpDir}/**/*.js`);
  expect(files).toContain('app/load.js');
});

test('Action create one more', async () => {
  const entity = getEntity('app:save');
  await createAction(entity, { force: true });
  const files = await globRelative(tmpDir, `${tmpDir}/**/*.js`);
  expect(files).toContain('app/load.js');
  expect(files).toContain('app/save.js');
});

test('Action sync indexes', async () => {
  const entities = await getEntities();
  await generateActionsIndex(entities);
  const files = await globRelative(tmpDir, `${tmpDir}/**/*.js`);
  expect(files).toContain('app/load.js');
  expect(files).toContain('app/save.js');
  expect(files).toContain('index.js');
});
