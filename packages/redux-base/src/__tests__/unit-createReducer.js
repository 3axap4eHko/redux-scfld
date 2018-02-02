import { STATUS_START, STATUS_SUCCESS, STATUS_ERROR } from '../constants';
import createReducer from '../createReducer';

const NAMESPACE_APP = 'app';
const APP_LOAD = 'load';

const reducer = createReducer();

const state = {
  [NAMESPACE_APP]: {},
};

test('action start reducer', () => {
  const newState = reducer(state, {
    namespace: NAMESPACE_APP,
    type: APP_LOAD,
    status: STATUS_START,
  });
  expect(state).toBe(newState);
});

test('action success reducer', () => {
  const newState = reducer(state, {
    namespace: NAMESPACE_APP,
    type: APP_LOAD,
    status: STATUS_SUCCESS,
    result: {},
  });
  expect(state).not.toBe(newState);
  expect(state).toMatchObject(newState);
});

test('action error reducer', done => {
  const error = new Error();
  const _errorLog = console.error;
  console.error = e => {
    expect(e).toBe(error);
    done();
  };
  const newState = reducer(state, {
    namespace: NAMESPACE_APP,
    type: APP_LOAD,
    status: STATUS_ERROR,
    error,
  });
  expect(state).toBe(newState);
  console.error = _errorLog;
});
