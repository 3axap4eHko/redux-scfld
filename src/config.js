'use strict';

import Fs from 'fs';
import Path from 'path';

const defaultConfig = {
    actionsPath: './app/actions',
    actionTemplatePath: Path.join(__dirname, 'templates', 'action.jst'),
    actionsIndexTemplatePath: Path.join(__dirname, 'templates', 'action-index.jst'),
    reducersPath: './app/reducers',
    reducerTemplatePath: Path.join(__dirname, 'templates', 'reducer.jst'),
    reducersIndexTemplatePath: Path.join(__dirname, 'templates', 'reducer-index.jst'),
    typesPath: './app/types',
    typesTemplatePath: Path.join(__dirname, 'templates', 'types.jst'),
    statesPath: './app/states',
    stateTemplatePath: Path.join(__dirname, 'templates', 'state.jst'),
    statesIndexTemplatePath: Path.join(__dirname, 'templates', 'state-index.jst')
};

export default Object.freeze(Object.assign({}, defaultConfig, Fs.existsSync('./.reduxrc') ? JSON.parse(Fs.readFileSync('./.reduxrc', 'utf8')) : {}));
