'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
    actionsPath: './app/actions',
    actionTemplatePath: _path2.default.join(__dirname, 'templates', 'action.jst'),
    actionsIndexTemplatePath: _path2.default.join(__dirname, 'templates', 'action-index.jst'),
    reducersPath: './app/reducers',
    reducerTemplatePath: _path2.default.join(__dirname, 'templates', 'reducer.jst'),
    reducersIndexTemplatePath: _path2.default.join(__dirname, 'templates', 'reducer-index.jst'),
    typesPath: './app/types',
    typesTemplatePath: _path2.default.join(__dirname, 'templates', 'types.jst'),
    statesPath: './app/states',
    stateTemplatePath: _path2.default.join(__dirname, 'templates', 'state.jst'),
    statesIndexTemplatePath: _path2.default.join(__dirname, 'templates', 'state-index.jst')
};

exports.default = Object.freeze(Object.assign({}, defaultConfig, _fs2.default.existsSync('./.reduxrc') ? JSON.parse(_fs2.default.readFileSync('./.reduxrc', 'utf8')) : {}));