import {
  STATUS_PROCESS,
  STATUS_SUCCESS,
  STATUS_FAILURE,
} from './types';

function reducer(state, action) {
  switch (action.status) {
    case STATUS_PROCESS:
      return state;
    case STATUS_SUCCESS:
      return action.result;
    case STATUS_FAILURE:
      console.error(action.error); // eslint-disable-line no-console
      return state;
  }
  return state;
}

export default function createReducer(defaultState) {
  return function (state = defaultState, action) {
    const { namespace } = action;
    const prevNamespaceState = state[namespace];
    const nextNamespaceState = reducer(prevNamespaceState, action);
    if (typeof nextNamespaceState === 'undefined') {
      throw new Error(`State from action '${action.namespace}:${action.type}' cannot be undefined`);
    }
    if (prevNamespaceState !== nextNamespaceState) {
      return { ...state, [namespace]: nextNamespaceState };
    }
    return state;
  };
}