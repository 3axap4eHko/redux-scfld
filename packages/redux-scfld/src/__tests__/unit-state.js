import { resolve } from 'path';
import { createState, generateStatesIndex } from '../state';
import { globRelative, getEntity, getEntities } from '../utils';

const tmpDir = resolve(__dirname + '/../../tmp/states');

test('State create', async () => {
  const entity = getEntity('app:load');
  await createState(entity, { force: true });
  const files = await globRelative(tmpDir, `${tmpDir}/**/*.js`);
  expect(files).toContain('app.js');
});

test('State sync indexes', async () => {
  const entities = await getEntities();
  await generateStatesIndex(entities);
  const files = await globRelative(tmpDir, `${tmpDir}/**/*.js`);
  expect(files).toContain('app.js');
  expect(files).toContain('index.js');
});
