'use strict';
const Fs = require('fs');
const Path = require('path');
const Glob = require('glob');
const _ = require('lodash');

const pathSplitterExpr = /\/|\\/g;
const pathExtractExpr = /^(\w+?)([A-Z].*)/;

function createIfNotExists(path) {
    if (!Fs.existsSync(path)) {
        Fs.mkdirSync(path)
    }
    return path;
}

function mkDir(path) {
    if (Fs.existsSync(path)) return path;
    return path.split(pathSplitterExpr).reduce( (path, part) => createIfNotExists(Path.join(path, part)), '');
}

function relative(from, to) {
    return Path.relative(from, to).replace(/\\/g,'/');
}

const PHASES = {
    none: 'NONE',
    request: `REQUEST`,
    success: `SUCCESS`,
    failure: `FAILURE`
};

function getType(actionName) {
    return actionName.replace(/([A-Z])/g, '_$1').toUpperCase();
}

function getFilename(baseName) {
    return `${baseName.replace(/(\w)([A-Z])/g, '$1-$2').toLowerCase()}.js`;
}

function getName(path) {
    const [,name] = path.replace(/\\/g, '/').match(/\/(\w+\/[\w\-]+?)(\.js)?$/);
    return _.camelCase(name);
}

function getEntity(name, config) {
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
        actionFolder: Path.join(config.paths.actions, namespace).replace(/\\/g,'/'),
        actionPath: Path.join(config.paths.actions, namespace, filename).replace(/\\/g,'/'),
        reducerFolder: Path.join(config.paths.reducers, namespace).replace(/\\/g,'/'),
        reducerPath: Path.join(config.paths.reducers, namespace, filename).replace(/\\/g,'/'),
    };
}

function getEntities(config, addEntity) {
    return Glob.sync(Path.join(config.paths.actions, '*','*.js'), {root: config.paths.actions}).reduce((entities, filename) => {
        const name = getName(filename);
        const entity = getEntity(name, config);
        if(!entities[entity.namespace]) {
            entities[entity.namespace] = {};
        }
        entities[entity.namespace][entity.name] = entity;
        return entities;
    }, addEntity ? {[addEntity.namespace]: {[addEntity.name]: addEntity} } : {});
}

function eachEntity(entities, callback) {
    Object.keys(entities).forEach( namespace => {
        Object.keys(entities[namespace]).forEach( name => {
            callback(entities[namespace][name], name, namespace, entities);
        })
    });
}

module.exports = {
    mkDir,
    relative,
    getFilename,
    getName,
    getEntity,
    getEntities,
    eachEntity,
};