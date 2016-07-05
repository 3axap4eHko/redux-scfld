'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createState = createState;
exports.generateStatesIndex = generateStatesIndex;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _config = require('./config');

var _utils = require('./utils');

var _templateOptions = require('./template-options');

var _templateOptions2 = _interopRequireDefault(_templateOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stateTemplate = (0, _lodash.template)(_fs2.default.readFileSync(_config.loadedConfig.stateTemplatePath), _templateOptions2.default);
var indexTemplate = (0, _lodash.template)(_fs2.default.readFileSync(_config.loadedConfig.statesIndexTemplatePath), _templateOptions2.default);

function createState(entity) {
    (0, _utils.mkDir)(_config.loadedConfig.statesPath);
    if (!_fs2.default.existsSync(entity.statePath)) {
        var content = stateTemplate(entity);
        _fs2.default.writeFileSync(entity.statePath, content);
    }
}

function generateStatesIndex(entities) {
    (0, _utils.mkDir)(_config.loadedConfig.statesPath);
    var content = indexTemplate({ entities: entities });
    _fs2.default.writeFileSync(_path2.default.join(_config.loadedConfig.statesPath, 'index.js'), content);
    return entities;
}