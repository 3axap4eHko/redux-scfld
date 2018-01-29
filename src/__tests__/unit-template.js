import { compile } from '../cli/template';

test('test function', async () => {
  const compiled = await compile(__dirname + '/../__fixtures__/templates/testFunc.dot');
  expect(compiled({ testFunc: () => 1 })).toBe('Test func: 1');
});

test('test variable', async () => {
  const compiled = await compile(__dirname + '/../__fixtures__/templates/testVar.dot');
  expect(compiled({ testVar: 1 })).toBe('Test var: 1');
});

