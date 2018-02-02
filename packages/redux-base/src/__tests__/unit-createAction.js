import { STATUS_START, STATUS_SUCCESS, STATUS_ERROR } from '../constants';
import createAction from '../createAction';

const NAMESPACE_APP = 'app';
const APP_LOAD = 'load';

async function executeAction(actionCreator, state) {
  const actions = [];
  await actionCreator(async action => actions.push(action), () => state);
  return actions;
}

test('create successful action', async () => {
  const loadAppAction = createAction(NAMESPACE_APP, APP_LOAD, (getState, value) => {
    return value * 2;
  });
  const input = 1;
  const actions = await executeAction(loadAppAction(input));

  expect(actions.length).toBe(2);

  const [startAction, doneAction] = actions;

  expect(startAction.namespace).toBe(NAMESPACE_APP);
  expect(startAction.type).toBe(APP_LOAD);
  expect(startAction.status).toBe(STATUS_START);
  expect(startAction.args).toMatchObject([input]);

  expect(doneAction.namespace).toBe(NAMESPACE_APP);
  expect(doneAction.type).toBe(APP_LOAD);
  expect(doneAction.status).toBe(STATUS_SUCCESS);
  expect(doneAction.result).toBe(input * 2);
});

test('create error action', async () => {
  const loadAppAction = createAction(NAMESPACE_APP, APP_LOAD, () => {
    throw new Error('Failed');
  });
  const input = 1;
  const actions = await executeAction(loadAppAction(input));

  expect(actions.length).toBe(2);

  const [startAction, doneAction] = actions;

  expect(startAction.namespace).toBe(NAMESPACE_APP);
  expect(startAction.type).toBe(APP_LOAD);
  expect(startAction.status).toBe(STATUS_START);
  expect(startAction.args).toMatchObject([input]);

  expect(doneAction.namespace).toBe(NAMESPACE_APP);
  expect(doneAction.type).toBe(APP_LOAD);
  expect(doneAction.status).toBe(STATUS_ERROR);

});

