'use strict';

import thunkMiddleware from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import reducers from './app/reducers';

export default function () {
    return createStore(reducers, applyMiddleware(thunkMiddleware));
}