import { resolve, relative } from 'path';
import * as API from '../api';
import { glob } from '../utils';

const tmpDir = resolve(__dirname + '/../../tmp');

async function globRel(pattern) {
  return (await glob(pattern))
    .map(file => relative(tmpDir, file));
}

test('API add entity', async () => {
  await API.add(['app:load', 'app:save'], { force: true });
  const files = await globRel(`${tmpDir}/**/*.js`);

  expect(files).toContain('actions/app/load.js');
  expect(files).toContain('actions/app/save.js');
  expect(files).toContain('actions/index.js');

  expect(files).toContain('states/app.js');
  expect(files).toContain('states/index.js');

  expect(files).toContain('types/index.js');
});

test('API add one more entity', async () => {
  await API.add(['app:reset'], { force: true });
  const files = await globRel(`${tmpDir}/**/*.js`);

  expect(files).toContain('actions/app/load.js');
  expect(files).toContain('actions/app/save.js');
  expect(files).toContain('actions/app/reset.js');
  expect(files).toContain('actions/index.js');

  expect(files).toContain('states/app.js');
  expect(files).toContain('states/index.js');

  expect(files).toContain('types/index.js');
});

test('API add one more entity', async () => {
  await API.add(['config:load'], { force: true });
  const files = await globRel(`${tmpDir}/**/*.js`);

  expect(files).toContain('actions/app/load.js');
  expect(files).toContain('actions/app/load.js');
  expect(files).toContain('actions/app/save.js');
  expect(files).toContain('actions/config/load.js');
  expect(files).toContain('actions/index.js');

  expect(files).toContain('states/app.js');
  expect(files).toContain('states/config.js');
  expect(files).toContain('states/index.js');

  expect(files).toContain('types/index.js');
});

test('API del entity', async () => {
  await API.del(['app:save', 'config:load'], { force: true });
  const files = await globRel(`${tmpDir}/**/*.js`);

  expect(files).toContain('actions/app/load.js');
  expect(files).toContain('actions/app/reset.js');
  expect(files).toContain('actions/index.js');

  expect(files).toContain('states/app.js');
  expect(files).toContain('states/index.js');

  expect(files).toContain('types/index.js');
});
