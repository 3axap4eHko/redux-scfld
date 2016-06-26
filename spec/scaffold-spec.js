'use strict';

import createStore from './app/store';
import {postsFetchPage} from './app/actions';

describe('Scaffold test suite:', () => {
    const store = createStore();
    it('Test dispatch/listen action', done => {
        const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (state.result) {
                expect(state.result).toEqual('test');
                unsubscribe();
                done()
            }
        });
        store.dispatch(postsFetchPage('test'))
    });
});