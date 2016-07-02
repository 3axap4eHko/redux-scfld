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

var _config2 = _interopRequireDefault(_config);

var _utils = require('./utils');

var _templateOptions = require('./template-options');

var _templateOptions2 = _interopRequireDefault(_templateOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//TODO Namespaced, standard
var reducerTemplate = (0, _lodash.template)(_fs2.default.readFileSync(_config2.default.reducerTemplatePath), _templateOptions2.default);
var indexTemplate = (0, _lodash.template)(_fs2.default.readFileSync(_config2.default.reducersIndexTemplatePath), _templateOptions2.default);

function createReducer(entity, options) {
    (0, _utils.mkDir)(entity.reducerFolder);
    if (_fs2.default.existsSync(entity.reducerPath) && !options.force) {
        throw new Error('Reducer \'' + entity.fullName + '\' already exists');
    }
    var content = reducerTemplate({
        entity: entity,
        typePath: (0, _utils.relative)(entity.reducerFolder, _config2.default.typesPath),
        statePath: (0, _utils.relative)(entity.reducerFolder, entity.statePath)
    });
    _fs2.default.writeFileSync(entity.reducerPath, content);
}
function generateReducersIndex(entities) {
    (0, _utils.mkDir)(_config2.default.reducersPath);
    var content = indexTemplate({
        entities: entities,
        typePath: (0, _utils.relative)(_config2.default.reducersPath, _config2.default.typesPath),
        statesPath: _config2.default.statesPath ? (0, _utils.relative)(_config2.default.reducersPath, _config2.default.statesPath) : false
    });
    _fs2.default.writeFileSync(_path2.default.join(_config2.default.reducersPath, 'index.js'), content);
}