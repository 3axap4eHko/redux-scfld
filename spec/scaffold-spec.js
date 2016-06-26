'use strict';

import createStore from './store';
import {postsFetchPage, postsThrowError} from './app/actions';

describe('Scaffold test suite:', () => {

    it('Test dispatch/listen action progress', done => {
        const store = createStore();
        const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (state.has('progress')) {
                expect(state.get('default')).toEqual('test', 'testing default value');
                expect(state.get('progress')).toBeTruthy();
                unsubscribe();
                done();
            }
        });
        store.dispatch(postsFetchPage( () => {} ))
    });
    it('Test dispatch/listen action result', done => {
        const store = createStore();
        const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (state.has('result')) {
                expect(state.get('default')).toEqual('test', 'testing default value');
                expect(state.get('result')).toEqual('test', 'testing result value');
                expect(state.get('progress')).toBeFalsy();
                unsubscribe();
                done();
            }
        });
        store.dispatch(postsFetchPage( () => 'test' ))
    });
    it('Test dispatch/listen action failure', done => {
        const store = createStore();
        const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (state.has('error')) {
                expect(state.get('default')).toEqual('test', 'testing default value');
                expect(state.get('error') instanceof Error).toBeTruthy();
                expect(state.get('progress')).toBeFalsy();
                unsubscribe();
                done();
            }
        });
        store.dispatch(postsThrowError( () => {throw new Error()} ));
    });
});