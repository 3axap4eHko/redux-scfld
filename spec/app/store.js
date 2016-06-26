'use strict';

import thunkMiddleware from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers';

export default function (initialState) {
    return createStore(reducers,
        initialState,
        applyMiddleware(
            thunkMiddleware
        ));
}