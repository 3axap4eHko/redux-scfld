'use strict';

import Fs from 'fs';
import Path from 'path';
import {template} from 'lodash';
import config from './config';
import {mkDir, relative} from './utils';
import templateOptions  from './template-options';

//TODO Namespaced, standard
const reducerTemplate = template(Fs.readFileSync(config.reducerTemplatePath), templateOptions);
const indexTemplate = template(Fs.readFileSync(config.reducersIndexTemplatePath), templateOptions);

export function createReducer(entity, options) {
    mkDir(entity.reducerFolder);
    if (Fs.existsSync(entity.reducerPath) && !options.force) {
        throw new Error(`Reducer '${entity.fullName}' already exists`)
    }
    const content = reducerTemplate({
        entity,
        typePath: relative(entity.reducerFolder, config.typesPath),
        statePath: relative(entity.reducerFolder, entity.statePath)
    });
    Fs.writeFileSync(entity.reducerPath, content);
}
export function generateReducersIndex(entities) {
    mkDir(config.reducersPath);
    const content = indexTemplate({
        entities,
        typePath: relative(config.reducersPath, config.typesPath),
        statesPath: config.statesPath ? relative(config.reducersPath, config.statesPath) : false
    });
    Fs.writeFileSync(Path.join(config.reducersPath, 'index.js'), content);
}
