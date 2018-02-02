import {
  STATUS_START,
  STATUS_SUCCESS,
  STATUS_ERROR,
} from './constants';

function startActionCreator(namespace, type, ...args) { // eslint-disable-line no-underscore-dangle
  return {
    namespace,
    type,
    status: STATUS_START,
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

function failActionCreator(namespace, type, error, args) { // eslint-disable-line no-underscore-dangle
  return {
    namespace,
    type,
    status: STATUS_ERROR,
    args,
    error,
  };
}

export default function createAction(namespace, type, action) { // eslint-disable-line no-underscore-dangle
  return (...args) => (dispatch, getState) => {
    return dispatch(startActionCreator(namespace, type, ...args))
      .then(() => action(getState, ...args))
      .then(result => dispatch(successActionCreator(namespace, type, result)))
      .catch(error => dispatch(failActionCreator(namespace, type, error, args)));
  };
}