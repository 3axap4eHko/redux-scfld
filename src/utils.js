'use strict';

import Fs from 'fs';
import Path from 'path';
import Glob from 'glob';
import {camelCase, upperFirst, lowerFirst}  from 'lodash';
import config from './config';

const slashReplaceExpr = /\\/g;
const pathSplitterExpr = /\/|\\/g;
const pathExtractExpr = /(?![A-Z])(\w)([A-Z])/g;
const namespaceExtractExpr = /^(\w+?)([A-Z].*)/;
const nameExtractExpr = /\/(\w+\/[\w\-]+?)(\.js)?$/;

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
    return Path.relative(from, to).replace(slashReplaceExpr,'/');
}

export function getType(actionName) {
    return actionName.replace(pathExtractExpr, '$1_$2').toUpperCase();
}

export function getFilename(baseName) {
    return `${baseName.replace(pathExtractExpr, '$1-$2').toLowerCase()}.js`;
}

export function getName(path) {
    const [,name] = path.replace(slashReplaceExpr, '/').match(nameExtractExpr);
    return camelCase(name);
}

export function getEntity(name) {
    const [,namespace, baseName] = name.match(namespaceExtractExpr);
    const filename = getFilename(baseName);
    return {
        namespace,
        fullName: name,
        FullName: upperFirst(name),
        name: lowerFirst(baseName),
        Name: baseName,
        TYPE: getType(name),
        filename: filename,
        path: Path.join(namespace, filename).replace(slashReplaceExpr,'/'),
        actionFolder: Path.join(config.actionsPath, namespace).replace(slashReplaceExpr,'/'),
        actionPath: Path.join(config.actionsPath, namespace, filename).replace(slashReplaceExpr,'/'),
        reducerFolder: Path.join(config.reducersPath, namespace).replace(slashReplaceExpr,'/'),
        reducerPath: Path.join(config.reducersPath, namespace, filename).replace(slashReplaceExpr,'/')
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