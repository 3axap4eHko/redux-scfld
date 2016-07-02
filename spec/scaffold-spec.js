'use strict';

import createStore from './store';
import {testSuccess, testFailure} from './app/actions';

const defaultValue = 'defaultValue';

describe('Scaffold test suite:', () => {

    it('Test dispatch/listen action progress', done => {
        const store = createStore();
        const unsubscribe = store.subscribe(() => {
            const state = store.getState().test;
            if ('process' in state) {
                expect(state.defaultValue).toEqual(defaultValue, 'testing default value');
                expect(state.process).toBeTruthy();
                unsubscribe();
                done();
            }
        });
        store.dispatch(testSuccess( () => {} ))
    });
    it('Test dispatch/listen action result', done => {
        const store = createStore();
        const unsubscribe = store.subscribe(() => {
            const state = store.getState().test;
            if ('result' in state) {
                expect(state.defaultValue).toEqual(defaultValue, 'testing default value');
                expect(state.result).toEqual('test', 'testing result value');
                expect(state.process).toBeFalsy();
                unsubscribe();
                done();
            }
        });
        store.dispatch(testSuccess( () => 'test' ))
    });
    it('Test dispatch/listen action failure', done => {
        const store = createStore();
        const unsubscribe = store.subscribe(() => {
            const state = store.getState().test;
            if ('error' in state) {
                expect(state.defaultValue).toEqual(defaultValue, 'testing default value');
                expect(state.error instanceof Error).toBeTruthy();
                expect(state.process).toBeFalsy();
                unsubscribe();
                done();
            }
        });
        store.dispatch(testFailure( () => {throw new Error()} ));
    });
});