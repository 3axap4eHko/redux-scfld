'use strict';

import Fs from 'fs';
import Path from 'path';
import Glob from 'glob';
import _ from 'lodash';
import config from './config';

const pathSplitterExpr = /\/|\\/g;
const pathExtractExpr = /^(\w+?)([A-Z].*)/;

function createIfNotExists(path) {
    if (!Fs.existsSync(path)) {
        Fs.mkdirSync(path)
    }
    return path;
}

export function mkDir(path) {
    if (Fs.existsSync(path)) return path;
    return path.split(pathSplitterExpr).reduce( (path, part) => createIfNotExists(Path.join(path, part)), '');
}

export function relative(from, to) {
    return Path.relative(from, to).replace(/\\/g,'/');
}

export function getType(actionName) {
    return actionName.replace(/(?![A-Z])(\w)([A-Z])/g, '$1_$2').toUpperCase();
}

export function getFilename(baseName) {
    return `${baseName.replace(/(\w)([A-Z])/g, '$1-$2').toLowerCase()}.js`;
}

export function getName(path) {
    const [,name] = path.replace(/\\/g, '/').match(/\/(\w+\/[\w\-]+?)(\.js)?$/);
    return _.camelCase(name);
}

export function getEntity(name) {
    const [,namespace, baseName] = name.match(pathExtractExpr);
    const filename = getFilename(baseName);

    return {
        namespace,
        fullName: name,
        FullName: _.upperFirst(name),
        name: _.lowerFirst(baseName),
        Name: baseName,
        TYPE: getType(name),
        filename: filename,
        path: Path.join(namespace, filename).replace(/\\/g,'/'),
        actionFolder: Path.join(config.actionsPath, namespace).replace(/\\/g,'/'),
        actionPath: Path.join(config.actionsPath, namespace, filename).replace(/\\/g,'/'),
        reducerFolder: Path.join(config.reducersPath, namespace).replace(/\\/g,'/'),
        reducerPath: Path.join(config.reducersPath, namespace, filename).replace(/\\/g,'/')
    };
}

export function getEntities(addEntity) {
    return Glob.sync(Path.join(config.actionsPath, '*','*.js'), {root: config.actionsPath}).reduce((entities, filename) => {
        const name = getName(filename);
        const entity = getEntity(name, config);
        if(!entities[entity.namespace]) {
            entities[entity.namespace] = {};
        }
        entities[entity.namespace][entity.name] = entity;
        return entities;
    }, addEntity ? {[addEntity.namespace]: {[addEntity.name]: addEntity} } : {});
}

export function eachEntity(entities, callback) {
    Object.keys(entities).forEach( namespace => {
        Object.keys(entities[namespace]).forEach( name => {
            callback(entities[namespace][name], name, namespace, entities);
        })
    });
}