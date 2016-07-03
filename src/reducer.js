'use strict';

import Fs from 'fs';
import Path from 'path';
import {template} from 'lodash';
import config from './config';
import {mkDir} from './utils';
import templateOptions  from './template-options';

const reducerTemplate = template(Fs.readFileSync(config.reducerTemplatePath), templateOptions);
const indexTemplate = template(Fs.readFileSync(config.reducersIndexTemplatePath), templateOptions);

export function createReducer(entity, options) {
    mkDir(entity.reducerFolder);
    if (Fs.existsSync(entity.reducerPath) && !options.force) {
        throw new Error(`Reducer '${entity.fullName}' already exists`)
    }
    const content = reducerTemplate({entity});
    Fs.writeFileSync(entity.reducerPath, content);
}
export function generateReducersIndex(entities) {
    mkDir(config.reducersPath);
    const content = indexTemplate({entities});
    Fs.writeFileSync(Path.join(config.reducersPath, 'index.js'), content);
}
