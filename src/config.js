'use strict';

import Fs from 'fs';
import {join} from './utils';

export const defaultConfig = Object.freeze({
    actionsPath: './app/actions',
    actionTemplatePath: join(__dirname, 'templates', 'action.jst'),
    actionsIndexTemplatePath: join(__dirname, 'templates', 'action-index.jst'),
    reducersPath: './app/reducers',
    reducerTemplatePath: join(__dirname, 'templates', 'reducer.jst'),
    reducersIndexTemplatePath: join(__dirname, 'templates', 'reducer-index.jst'),
    typesPath: './app/types',
    typesTemplatePath: join(__dirname, 'templates', 'types.jst'),
    statesPath: './app/states',
    stateTemplatePath: join(__dirname, 'templates', 'state.jst'),
    statesIndexTemplatePath: join(__dirname, 'templates', 'state-index.jst')
});

export const loadedConfig = Object.freeze(Object.assign({}, defaultConfig, Fs.existsSync('./.reduxrc') ? JSON.parse(Fs.readFileSync('./.reduxrc', 'utf8')) : {}));
