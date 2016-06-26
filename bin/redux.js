#! /usr/bin/env node

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

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

var args = _process$argv$slice2.slice(1);

var _ref = (args[0] || '').match(/(\w+)/) || [];

var _ref2 = _slicedToArray(_ref, 2);

var name = _ref2[1];

var options = {
    force: ~args.indexOf('-f') || ~args.indexOf('--force')
};

var commands = {
    help: function help() {
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
    config: function config() {
        var baseConfig = {
            actionsPath: './app/actions',
            reducersPath: './app/reducers',
            typesPath: './app/types',
            defaultStatePath: false
        };
        _fs2.default.writeFileSync('.reduxrc', JSON.stringify(baseConfig));
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
    },
    idx: function idx() {
        var entities = (0, _utils.getEntities)();
        (0, _action.generateActionsIndex)(entities);
        console.log('[Redux] Actions index generated');
        (0, _types2.default)(entities);
        console.log('[Redux] Types index generated');
        (0, _reducer.generateReducersIndex)(entities);
        console.log('[Redux] Reducers index generated');
    },
    ls: function ls() {
        var entities = (0, _utils.getEntities)();
        (0, _utils.eachEntity)(entities, function (entity) {
            return console.log('' + entity.fullName);
        });
    },
    types: function types() {
        var entities = (0, _utils.getEntities)();
        (0, _utils.eachEntity)(entities, function (entity) {
            return console.log('' + entity.TYPE);
        });
    }
};

if (!commands[command]) {
    command = 'help';
}
commands[command](name, options);