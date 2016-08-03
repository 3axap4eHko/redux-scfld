'use strict';

import Fs from 'fs';
import Path from 'path';
import Glob from 'glob';
import { camelCase, upperFirst, lowerFirst }  from 'lodash';
import { loadedConfig as config } from './config';

const slashReplaceExpr = /\\/g;
const pathSplitterExpr = /\/|\\/g;
const pathExtractExpr = /(?![A-Z])(\w)([A-Z])/g;
const nameExtractExpr = /\/([\w\-]+)\/([\w\-]+)(\.js)?$/;

function createIfNotExists(path) {
    if ( !Fs.existsSync( path ) ) {
        Fs.mkdirSync( path )
    }
    return path;
}

export function mkDir(path) {
    if ( Fs.existsSync( path ) ) return path;
    return path.split( pathSplitterExpr ).reduce( (path, part) => createIfNotExists( Path.join( path, part ) ), '' );
}

export function relative(from, to) {
    return Path.relative( from, to ).replace( slashReplaceExpr, '/' );
}

export function join(...paths) {
    return Path.join( ...paths ).replace( slashReplaceExpr, '/' );
}

export function getType(actionName) {
    return actionName.replace( pathExtractExpr, '$1_$2' ).toUpperCase();
}

export function getFilename(baseName) {
    if (config.useCamelCasedPaths) {
        return `${camelCase( baseName )}.js`;
    }
    return `${baseName.replace( pathExtractExpr, '$1-$2' ).toLowerCase()}.js`;
}

export function getFolderName(namespace) {
    if (config.useCamelCasedPaths) {
        return camelCase(namespace);
    }
    return `${namespace.replace( pathExtractExpr, '$1-$2' ).toLowerCase()}`;
}

export function getName(path) {
    const [, namespace, name] = path.replace( slashReplaceExpr, '/' ).match( nameExtractExpr );
    return `${camelCase( namespace )}:${camelCase( name )}`;
}

// test:failure
export function getEntity(code) {
    const [namespace, name] = code.split( ':' );
    const fullName = camelCase( code );
    const foldername = getFolderName( namespace );
    const filename = getFilename( name );
    return {
        namespace,
        NAMESPACE: namespace.toUpperCase(),
        fullName: fullName,
        FullName: upperFirst( fullName ),
        name: lowerFirst( name ),
        Name: name,
        TYPE: getType( fullName ),
        foldername: foldername,
        filename: filename,
        path: Path.join( foldername, filename ).replace( slashReplaceExpr, '/' ),
        actionFolder: Path.join( config.actionsPath, foldername ).replace( slashReplaceExpr, '/' ),
        actionPath: Path.join( config.actionsPath, foldername, filename ).replace( slashReplaceExpr, '/' ),
        reducerFolder: Path.join( config.reducersPath, foldername ).replace( slashReplaceExpr, '/' ),
        reducerPath: Path.join( config.reducersPath, foldername, filename ).replace( slashReplaceExpr, '/' ),
        statePath: Path.join( config.statesPath, foldername ).replace( slashReplaceExpr, '/' ) + '.js'
    };
}

export function getEntities(addEntity) {
    return Glob.sync( Path.join( config.actionsPath, '*', '*.js' ), { root: config.actionsPath } ).reduce( (entities, filename) => {
        const name = getName( filename );
        const entity = getEntity( name, config );
        if ( !entities[entity.namespace] ) {
            entities[entity.namespace] = {};
        }
        entities[entity.namespace][entity.name] = entity;
        return entities;
    }, addEntity ? { [addEntity.namespace]: { [addEntity.name]: addEntity } } : {} );
}

export function eachEntity(entities, callback) {
    Object.keys( entities ).forEach( namespace => {
        Object.keys( entities[namespace] ).forEach( name => {
            callback( entities[namespace][name], name, namespace, entities );
        } )
    } );
}

export function mapEntity(entities, callback) {
    return Object.keys( entities ).reduce( (result, namespace) => {
        return result.concat( Object.keys( entities[namespace] ).map( name => {
            return callback( entities[namespace][name], name, namespace, entities );
        } ) )
    }, [] );
}