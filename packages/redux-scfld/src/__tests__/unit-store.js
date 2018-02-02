import { resolve } from 'path';
import { generateStoreCreator } from '../store';
import { globRelative } from '../utils';

const tmpDir = resolve(__dirname + '/../../tmp');

test('Store create', async () => {
  await generateStoreCreator();
  const files = await globRelative(tmpDir, `${tmpDir}/**/*.js`);
  expect(files).toContain('createStore.js');
});
