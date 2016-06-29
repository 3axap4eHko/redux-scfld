'use strict';

import Fs from 'fs';
import Path from 'path';
import {template} from 'lodash';

import config from './config';
import {mkDir, relative} from './utils';
import templateOptions  from './template-options';

const actionTemplate = template(Fs.readFileSync(config.actionTemplatePath), templateOptions);
const indexTemplate = template(Fs.readFileSync(config.actionsIndexTemplatePath), templateOptions);

export function createAction(entity, options) {
    mkDir(entity.actionFolder);
    if (Fs.existsSync(entity.actionPath) && !options.force) {
        throw new Error(`Action '${entity.fullName}' already exists`)
    }
    const content = actionTemplate(entity);
    Fs.writeFileSync(entity.actionPath, content);
}

export function generateActionsIndex(entities) {
    mkDir(config.actionsPath);
    const content = indexTemplate({
        entities,
        typePath: relative(config.actionsPath, config.typesPath)
    });
    Fs.writeFileSync(Path.join(config.actionsPath, 'index.js'), content);
    return entities;
}