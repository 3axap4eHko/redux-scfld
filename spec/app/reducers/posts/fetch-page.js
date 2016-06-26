/*! Generated by redux-scfld */
'use strict';

import {
    PROGRESS,
    SUCCESS,
    FAILURE,
} from '../../types';

export default function(state = {}, action) {
    switch(action.phase) {
        case PROGRESS:
            break;
        case SUCCESS:
            return {
                result: action.result
            };
            break;
        case FAILURE:
            break;
    }
    return state;
};