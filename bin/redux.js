'use strict';

const Fs = require('fs');

const defaultConfig = require('../src/default-config');
const {createAction, generateActionsIndex} = require('../src/action');
const generateTypes = require('../src/types');
const {createReducer, generateReducersIndex} = require('../src/reducer');
const {getEntity, getEntities} = require('../src/utils');
const config = Object.assign({}, defaultConfig, Fs.existsSync('./.reduxrc') ? JSON.parse(Fs.readFileSync('./.reduxrc', 'utf8')) : {});

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
        const entity = getEntity(name, config);
        const entities = getEntities(config, entity);
        createAction(entity, options, config);
        generateActionsIndex(entities, config);
        console.log(`Action ${entity.fullName} created`);
        generateTypes(entities, options, config);
        console.log(`Types created`);
        createReducer(entity, options, config);
        generateReducersIndex(entities, config);
        console.log(`Reducer created`);
    }
};

if (!commands[command]) {
    command = 'help';
}
commands[command](name, options);