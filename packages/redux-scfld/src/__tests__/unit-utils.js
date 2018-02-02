import * as Utils from '../utils';

test('lowerFirst', () => {
  expect(Utils.lowerFirst('TEST')).toBe('tEST');
  expect(Utils.lowerFirst('Test')).toBe('test');
});

test('upperFirst', () => {
  expect(Utils.upperFirst('tEST')).toBe('TEST');
  expect(Utils.upperFirst('test')).toBe('Test');
});

