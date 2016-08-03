'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadedConfig = exports.defaultConfig = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = exports.defaultConfig = Object.freeze({
    useCamelCasedPaths: false,
    actionsPath: './app/actions',
    actionTemplatePath: (0, _utils.join)(__dirname, 'templates', 'action.jst'),
    actionsIndexTemplatePath: (0, _utils.join)(__dirname, 'templates', 'action-index.jst'),
    reducersPath: './app/reducers',
    reducerTemplatePath: (0, _utils.join)(__dirname, 'templates', 'reducer.jst'),
    reducersIndexTemplatePath: (0, _utils.join)(__dirname, 'templates', 'reducer-index.jst'),
    typesPath: './app/types',
    typesTemplatePath: (0, _utils.join)(__dirname, 'templates', 'types.jst'),
    statesPath: './app/states',
    stateTemplatePath: (0, _utils.join)(__dirname, 'templates', 'state.jst'),
    statesIndexTemplatePath: (0, _utils.join)(__dirname, 'templates', 'state-index.jst')
});

var loadedConfig = exports.loadedConfig = Object.freeze(Object.assign({}, defaultConfig, _fs2.default.existsSync('./.reduxrc') ? JSON.parse(_fs2.default.readFileSync('./.reduxrc', 'utf8')) : {}));