'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = require('./config');

var _utils = require('./utils');

exports.default = {
    interpolate: /{([^\s]+)}/g,
    imports: {
        __warning_header: '/*! Generated by redux-scfld not for editing */',
        __info_header: '/*! Generated by redux-scfld */',
        config: _config.loadedConfig,
        eachEntity: _utils.eachEntity,
        mapEntity: _utils.mapEntity,
        relative: _utils.relative,
        getFolderName: _utils.getFolderName,
        i: function i(str) {
            return '${' + str + '}';
        }
    }
};