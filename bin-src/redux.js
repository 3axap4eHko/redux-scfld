#! /usr/bin/env node
'use strict';

import {createAction, generateActionsIndex} from '../dist/action';
import generateTypes from '../dist/types';
import {createReducer, generateReducersIndex} from '../dist/reducer';
import {getEntity, getEntities} from '../dist/utils';

var [command, name, ...args] = process.argv.slice(2);
const options = {
    force: ~args.indexOf('-f') || ~args.indexOf('--force')
};

const commands = {
    help() {
        console.log('React Redux Scaffold');
        console.log('rtrx create [actionName] [options]');
        console.log('\t options:');
        console.log('-f, --force  force creating');
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
    }
};

if (!commands[command]) {
    command = 'help';
}
commands[command](name, options);