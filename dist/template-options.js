'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    interpolate: /{([^\s]+)}/g,
    imports: {
        __warning_header: '/*! Generated by redux-scfld not for editing */',
        __info_header: '/*! Generated by redux-scfld */',
        config: _config2.default,
        eachEntity: _utils.eachEntity,
        mapEntity: _utils.mapEntity,
        relative: _utils.relative,
        i: function i(str) {
            return '${' + str + '}';
        }
    }
};