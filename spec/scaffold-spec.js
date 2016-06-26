'use strict';

import createStore from './store';
import {postsFetchPage} from './app/actions';

describe('Scaffold test suite:', () => {
    const store = createStore();
    it('Test dispatch/listen action', done => {
        const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (state.has('result')) {
                expect(state.get('default')).toEqual('test');
                expect(state.get('result')).toEqual('test');
                unsubscribe();
                done()
            }
        });
        store.dispatch(postsFetchPage('test'))
    });
});