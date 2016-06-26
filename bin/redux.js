#! /usr/bin/env node

'use strict';

var _action = require('../dist/action');

var _types = require('../dist/types');

var _types2 = _interopRequireDefault(_types);

var _reducer = require('../dist/reducer');

var _utils = require('../dist/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _process$argv$slice = process.argv.slice(2);

var _process$argv$slice2 = _toArray(_process$argv$slice);

var command = _process$argv$slice2[0];
var name = _process$argv$slice2[1];

var args = _process$argv$slice2.slice(2);

var options = {
    force: ~args.indexOf('-f') || ~args.indexOf('--force')
};

var commands = {
    help: function help() {
        console.log('React Redux Scaffold');
        console.log('rtrx create [actionName] [options]');
        console.log('\t options:');
        console.log('-f, --force  force creating');
    },
    create: function create(name, options) {
        var entity = (0, _utils.getEntity)(name);
        var entities = (0, _utils.getEntities)(entity);
        (0, _action.createAction)(entity, options);
        (0, _action.generateActionsIndex)(entities);
        console.log('[Redux] Action created: ' + entity.fullName);
        (0, _types2.default)(entities, options);
        console.log('[Redux] Type created: ' + entity.TYPE);
        (0, _reducer.createReducer)(entity, options);
        (0, _reducer.generateReducersIndex)(entities);
        console.log('[Redux] Reducer created: ' + entity.fullName);
    }
};

if (!commands[command]) {
    command = 'help';
}
commands[command](name, options);