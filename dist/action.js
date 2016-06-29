'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createAction = createAction;
exports.generateActionsIndex = generateActionsIndex;

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

var actionTemplate = (0, _lodash.template)(_fs2.default.readFileSync(_config2.default.actionTemplatePath), _templateOptions2.default);
var indexTemplate = (0, _lodash.template)(_fs2.default.readFileSync(_config2.default.actionsIndexTemplatePath), _templateOptions2.default);

function createAction(entity, options) {
    (0, _utils.mkDir)(entity.actionFolder);
    if (_fs2.default.existsSync(entity.actionPath) && !options.force) {
        throw new Error('Action \'' + entity.fullName + '\' already exists');
    }
    var content = actionTemplate(entity);
    _fs2.default.writeFileSync(entity.actionPath, content);
}

function generateActionsIndex(entities) {
    (0, _utils.mkDir)(_config2.default.actionsPath);
    var content = indexTemplate({
        entities: entities,
        typePath: (0, _utils.relative)(_config2.default.actionsPath, _config2.default.typesPath)
    });
    _fs2.default.writeFileSync(_path2.default.join(_config2.default.actionsPath, 'index.js'), content);
    return entities;
}