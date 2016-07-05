#! /usr/bin/env node

'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _action = require('../dist/action');

var _types = require('../dist/types');

var _types2 = _interopRequireDefault(_types);

var _reducer = require('../dist/reducer');

var _state = require('../dist/state');

var _utils = require('../dist/utils');

var _config = require('../dist/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _process$argv$slice = process.argv.slice(2);

var _process$argv$slice2 = _toArray(_process$argv$slice);

var command = _process$argv$slice2[0];

var args = _process$argv$slice2.slice(1);

var argFlagExpr = /^\-\-(\w+)$/;
var argFlagShortExpr = /^\-(\w+)$/;
var argFlagValueExpr = /^\-\-(\w+)=(.+)$/;
var argFlagNamesExpr = /^(\w+)$/;

var optionsMap = {
    f: 'force',
    t: 'templates'
};

function parseArgFlag(options, arg) {
    var matches = arg.match(argFlagExpr);
    if (matches) {
        options[matches[1]] = true;
        return true;
    }
}

function parseArgShortFlag(options, arg) {
    var matches = arg.match(argFlagShortExpr);
    if (matches) {
        Array.from(matches[1]).map(function (o) {
            return optionsMap[o];
        }).forEach(function (name) {
            options[name] = true;
        });
        return true;
    }
}

function parseArgValueFlag(options, arg) {
    var matches = arg.match(argFlagValueExpr);
    if (matches) {
        options[matches[1]] = matches[2];
        return true;
    }
}

function parseArgIdxFlag(options, arg, idx) {
    var matches = arg.match(argFlagNamesExpr);
    if (matches) {
        options[idx] = matches[1];
        return true;
    }
}

var parsers = [parseArgFlag, parseArgShortFlag, parseArgValueFlag, parseArgIdxFlag];
var options = args.reduce(function (options, arg, idx) {
    if (!parsers.some(function (parser) {
        return parser(options, arg, idx);
    })) {
        throw new Error('Unexpected argument: \'' + arg + '\'');
    }
    return options;
}, {});

var commands = {
    help: function help() {
        console.log('React Redux Scaffold');
        console.log('redux [command] [options]');
        console.log('commands:');
        console.log('config [-t]                        init config (use -t arg to add template sections )');
        console.log('create [actionName] [-f|--force]   creates action, reducer and type');
        console.log('update                             updates index files of actions, reducers and types');
        console.log('ls                                 list of entities');
        console.log('ns                                 list of namespaces');
        console.log('types                              list types');
        console.log('\t options:');
        console.log('-f, --force  force action');
    },
    config: function config() {
        var baseConfig;
        if (options.templates) {
            Object.assign(baseConfig, _config.defaultConfig);
        } else {
            baseConfig = {
                actionsPath: './app/actions',
                reducersPath: './app/reducers',
                typesPath: './app/types',
                statesPath: './app/states'
            };
        }
        _fs2.default.writeFileSync('.reduxrc', JSON.stringify(baseConfig, null, '  '));
    },
    create: function create(options) {
        var entity = (0, _utils.getEntity)(options[0]);
        var entities = (0, _utils.getEntities)(entity);
        (0, _action.createAction)(entity, options);
        (0, _action.generateActionsIndex)(entities);
        console.log('[Redux] Action created: ' + entity.fullName);
        (0, _types2.default)(entities, options);
        console.log('[Redux] Type created: ' + entity.TYPE);
        (0, _reducer.createReducer)(entity, options);
        (0, _reducer.generateReducersIndex)(entities);
        console.log('[Redux] Reducer created: ' + entity.fullName);
        (0, _state.createState)(entity, options);
        (0, _state.generateStatesIndex)(entities);
        console.log('[Redux] State created: ' + entity.namespace);
    },
    update: function update() {
        var entities = (0, _utils.getEntities)();
        (0, _action.generateActionsIndex)(entities);
        console.log('[Redux] Actions index generated');
        (0, _types2.default)(entities);
        console.log('[Redux] Types index generated');
        (0, _reducer.generateReducersIndex)(entities);
        console.log('[Redux] Reducers index generated');
        (0, _state.generateStatesIndex)(entities);
        console.log('[Redux] States index generated');
    },
    ls: function ls() {
        var entities = (0, _utils.getEntities)();
        (0, _utils.eachEntity)(entities, function (entity) {
            return console.log('' + entity.fullName);
        });
    },
    ns: function ns() {
        var entities = (0, _utils.getEntities)();
        Object.keys(entities).forEach(function (namespace) {
            return console.log('' + namespace);
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
commands[command](options);