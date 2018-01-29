import { resolve } from 'path';
import { createReducer, generateReducersIndex } from '../cli/reducer';
import { globRelative, getEntity, getEntities } from '../cli/utils';

const tmpDir = resolve(__dirname + '/../../tmp/reducers');

test('Reducer create', async () => {
  const entity = getEntity('app:load');
  await createReducer(entity, { force: true });
  const files = await globRelative(tmpDir, `${tmpDir}/**/*.js`);
  expect(files).toContain('app.js');
});

test('Reducer sync indexes', async () => {
  const entities = await getEntities();
  await generateReducersIndex(entities);
  const files = await globRelative(tmpDir, `${tmpDir}/**/*.js`);
  expect(files).toContain('app.js');
  expect(files).toContain('index.js');
});
