'use strict';

import Fs from 'fs';
import Path from 'path';
import _ from 'lodash';
import config from './config';
import {mkDir, relative} from './utils';
import templateOptions  from './template-options';

const reducerTemplate = _.template(Fs.readFileSync(config.reducerTemplatePath), templateOptions);
const indexTemplate = _.template(Fs.readFileSync(config.reducersIndexTemplatePath), templateOptions);

export function createReducer(entity, options) {
    mkDir(entity.reducerFolder);
    if (Fs.existsSync(entity.reducerPath) && !options.force) {
        throw new Error(`Reducer '${entity.fullName}' already exists`)
    }
    const content = reducerTemplate({
        entity,
        typesPath: relative(entity.reducerFolder, config.typesPath)
    });
    Fs.writeFileSync(entity.reducerPath, content);
}
export function generateReducersIndex(entities) {
    const content = indexTemplate({
        entities,
        typePath: relative(config.reducersPath, config.typesPath),
        defaultStatePath: config.defaultStatePath ? relative(config.reducersPath, config.defaultStatePath) : false
    });
    Fs.writeFileSync(Path.join(config.reducersPath, 'index.js'), content);
}
