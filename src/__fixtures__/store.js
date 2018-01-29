import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../../test/app/reducers/index';

export default function () {
    return createStore(reducers, applyMiddleware(thunkMiddleware));
}