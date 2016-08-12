'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createReducer = createReducer;
exports.generateReducersIndex = generateReducersIndex;

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

var reducerTemplate = (0, _lodash.template)(_fs2.default.readFileSync(_config.loadedConfig.reducerTemplatePath), _templateOptions2.default);
var indexTemplate = (0, _lodash.template)(_fs2.default.readFileSync(_config.loadedConfig.reducersIndexTemplatePath), _templateOptions2.default);

function createReducer(entity, options) {
    (0, _utils.mkDir)(_config.loadedConfig.reducersPath);
    if (!_fs2.default.existsSync(entity.reducerPath) || options.force) {
        var content = reducerTemplate({ entity: entity });
        _fs2.default.writeFileSync(entity.reducerPath, content);
    }
}
function generateReducersIndex(entities) {
    (0, _utils.mkDir)(_config.loadedConfig.reducersPath);
    var content = indexTemplate({ entities: entities });
    _fs2.default.writeFileSync(_path2.default.join(_config.loadedConfig.reducersPath, 'index.js'), content);
}