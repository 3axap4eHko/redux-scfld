'use strict';

import {eachEntity} from './utils';

export default {
    interpolate: /{([^\s]+)}/g,
    imports: {
        __warning_header: '/*! Generated by redux-scfld not for editing */',
        __info_header: '/*! Generated by redux-scfld */',
        eachEntity,
        i(str) { return `\${${str}}`;}
    }
};