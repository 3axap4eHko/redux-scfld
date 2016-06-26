#! /usr/bin/env node
'use strict';

import Fs from 'fs';
import {createAction, generateActionsIndex} from '../dist/action';
import generateTypes from '../dist/types';
import {createReducer, generateReducersIndex} from '../dist/reducer';
import {getEntity, getEntities, eachEntity} from '../dist/utils';

var [command, ...args] = process.argv.slice(2);

const [,name] = ((args[0] || '').match(/(\w+)/) || []);
const options = {
    force: ~args.indexOf('-f') || ~args.indexOf('--force')
};

const commands = {
    help() {
        console.log('React Redux Scaffold');
        console.log('redux [command] [options]');
        console.log('commands:');
        console.log('config                         init config');
        console.log('create [actionName] [options]  creates action, reducer and type');
        console.log('idx                            recalculate index files of actions, reducers and types');
        console.log('ls                             list entities');
        console.log('types                          list types');
        console.log('\t options:');
        console.log('-f, --force  force action');
    },
    config() {
        const baseConfig = {
            actionsPath: './app/actions',
            reducersPath: './app/reducers',
            typesPath: './app/types',
            defaultStatePath: false
        };
        Fs.writeFileSync('.reduxrc', JSON.stringify(baseConfig))
    },
    create(name, options) {
        const entity = getEntity(name);
        const entities = getEntities(entity);
        createAction(entity, options);
        generateActionsIndex(entities);
        console.log(`[Redux] Action created: ${entity.fullName}`);
        generateTypes(entities, options);
        console.log(`[Redux] Type created: ${entity.TYPE}`);
        createReducer(entity, options);
        generateReducersIndex(entities);
        console.log(`[Redux] Reducer created: ${entity.fullName}`);
    },
    idx() {
        const entities = getEntities();
        generateActionsIndex(entities);
        console.log('[Redux] Actions index generated');
        generateTypes(entities);
        console.log('[Redux] Types index generated');
        generateReducersIndex(entities);
        console.log('[Redux] Reducers index generated');
    },
    ls() {
        const entities = getEntities();
        eachEntity(entities, entity => console.log(`${entity.fullName}`));
    },
    types() {
        const entities = getEntities();
        eachEntity(entities, entity => console.log(`${entity.TYPE}`));
    }
};

if (!commands[command]) {
    command = 'help';
}
commands[command](name, options);