'use strict';

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

var typesTemplate = (0, _lodash.template)(_fs2.default.readFileSync(_config.loadedConfig.typesTemplatePath), _templateOptions2.default);

module.exports = function (entities) {
    (0, _utils.mkDir)(_config.loadedConfig.typesPath);
    var content = typesTemplate({ entities: entities });
    _fs2.default.writeFileSync(_path2.default.join(_config.loadedConfig.typesPath, 'index.js'), content);
};