'use strict';

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './app/reducers';

export default function () {
    return createStore(reducers, applyMiddleware(thunkMiddleware));
}