'use strict';

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

var typesTemplate = _lodash2.default.template(_fs2.default.readFileSync(_config2.default.typesTemplatePath), _templateOptions2.default);

module.exports = function (entities) {
    (0, _utils.mkDir)(_config2.default.typesPath);
    var content = typesTemplate({ entities: entities });
    _fs2.default.writeFileSync(_path2.default.join(_config2.default.typesPath, 'index.js'), content);
};