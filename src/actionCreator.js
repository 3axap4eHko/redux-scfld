import {
  STATUS_PROCESS,
  STATUS_SUCCESS,
  STATUS_FAILURE,
} from './types';

function processActionCreator(namespace, type, ...args) { // eslint-disable-line no-underscore-dangle
  return {
    namespace,
    type,
    status: STATUS_PROCESS,
    args,
  };
}
function successActionCreator(namespace, type, result) { // eslint-disable-line no-underscore-dangle
  return {
    namespace,
    type,
    status: STATUS_SUCCESS,
    result,
  };
}
function failureActionCreator(namespace, type, error, args) { // eslint-disable-line no-underscore-dangle
  return {
    namespace,
    type,
    status: STATUS_FAILURE,
    args,
    error,
  };
}

export default function createAction(namespace, type, action) { // eslint-disable-line no-underscore-dangle
  return (...args) => (dispatch, getState) => {
    return dispatch(processActionCreator(namespace, type, ...args))
      .then(() => action(getState, ...args))
      .then(result => dispatch(successActionCreator(namespace, type, result)))
      .catch(error => dispatch(failureActionCreator(namespace, type, error, args)));
  };
}