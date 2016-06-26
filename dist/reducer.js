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

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('./utils');

var _templateOptions = require('./template-options');

var _templateOptions2 = _interopRequireDefault(_templateOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducerTemplate = _lodash2.default.template(_fs2.default.readFileSync(_config2.default.reducerTemplatePath), _templateOptions2.default);
var indexTemplate = _lodash2.default.template(_fs2.default.readFileSync(_config2.default.reducersIndexTemplatePath), _templateOptions2.default);

function createReducer(entity, options) {
    (0, _utils.mkDir)(entity.reducerFolder);
    if (_fs2.default.existsSync(entity.reducerPath) && !options.force) {
        throw new Error('Reducer \'' + entity.fullName + '\' already exists');
    }
    var content = reducerTemplate({
        entity: entity,
        typesPath: (0, _utils.relative)(entity.reducerFolder, _config2.default.typesPath)
    });
    _fs2.default.writeFileSync(entity.reducerPath, content);
}
function generateReducersIndex(entities) {
    var content = indexTemplate({
        entities: entities,
        typePath: (0, _utils.relative)(_config2.default.reducersPath, _config2.default.typesPath),
        defaultStatePath: _config2.default.defaultStatePath ? (0, _utils.relative)(_config2.default.reducersPath, _config2.default.defaultStatePath) : false
    });
    _fs2.default.writeFileSync(_path2.default.join(_config2.default.reducersPath, 'index.js'), content);
}