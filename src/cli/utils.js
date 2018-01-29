import Fs from 'fs';
import Path from 'path';
import Glob from 'glob';
import Del from 'del';
import mkDirP from 'mkdirp';
import { promisify } from 'util';

import { loadedConfig as config } from './config';

const writeFileAsync = promisify(Fs.writeFile);
const accessAsync = promisify(Fs.access);
const mkDirPAsync = promisify(mkDirP);
const globAsync = promisify(Glob);

const slashReplaceExpr = /\\/g;
const pathExtractExpr = /(?![A-Z])(\w)([A-Z])/g;
const nameExtractExpr = /\/([\w-]+)\/([\w-]+)(\.js)?$/;
const extensionExpr = /\.\w+$/;
const splitExpr = /[_*.,:\s\-]+/;

export function lowerFirst(value) {
  return value[0].toLowerCase() + value.slice(1);
}

export function upperFirst(value) {
  return value[0].toUpperCase() + value.slice(1);
}

export function camelCase(value) {
  return value.split(splitExpr).map(upperFirst).join('');
}

export async function copy(from, to) {
  return new Promise(resolve => {
    Fs.createReadStream(from)
      .pipe(
        Fs.createWriteStream(to)
          .on('finish', () => resolve()),
      );
  });
}

export async function rm(filename, options) {
  return Del(filename, options);
}

export async function globRelative(relativePath, pattern, options) {
  return (await globAsync(pattern, options))
    .map(file => relative(relativePath, file));
}

export async function glob(...args) {
  return globAsync(...args);
}

export async function write(filename, content) {
  return writeFileAsync(filename, content);
}

export async function exists(filename) {
  return accessAsync(filename)
    .then(() => true)
    .catch(() => false);
}

export async function mkDir(path) {
  return mkDirPAsync(path);
}

export function relative(from, to) {
  return Path.relative(from, to).replace(slashReplaceExpr, '/');
}

export function join(...paths) {
  return Path.join(...paths).replace(slashReplaceExpr, '/');
}

export function resolve(...paths) {
  return Path.resolve(...paths).replace(slashReplaceExpr, '/');
}

export const configFile = resolve(process.cwd(), '.reduxrc');

export function getType(actionName) {
  return actionName.replace(pathExtractExpr, '$1_$2').toUpperCase();
}

export function getFilename(baseName) {
  if (config.useCamelCasedPaths) {
    return `${camelCase(baseName)}.js`;
  }
  return `${baseName.replace(pathExtractExpr, '$1-$2').toLowerCase()}.js`;
}

export function getFolderName(namespace) {
  if (config.useCamelCasedPaths) {
    return camelCase(namespace);
  }
  return `${namespace.replace(pathExtractExpr, '$1-$2').toLowerCase()}`;
}

export function getName(path) {
  const [, namespace, name] = path.replace(slashReplaceExpr, '/').match(nameExtractExpr);
  return `${camelCase(namespace)}:${camelCase(name)}`;
}

export function parseName(entityName) {
  return entityName.split(':').slice(0, 2);
}

// test:failure
export function getEntity(code) {
  const [namespace, name] = parseName(code);
  const fullName = camelCase(code);
  const foldername = getFolderName(namespace);
  const filename = getFilename(name);
  return {
    namespace,
    NAMESPACE: namespace.toUpperCase(),
    fullName,
    FullName: upperFirst(fullName),
    name: lowerFirst(name),
    Name: name,
    TYPE: getType(fullName),
    foldername,
    filename,
    path: Path.join(foldername, filename).replace(slashReplaceExpr, '/'),
    asModule: Path.join(foldername, filename).replace(slashReplaceExpr, '/').replace(extensionExpr, ''),
    actionFolder: Path.join(config.actionsPath, foldername).replace(slashReplaceExpr, '/'),
    actionPath: Path.join(config.actionsPath, foldername, filename).replace(slashReplaceExpr, '/'),
    reducerPath: Path.join(config.reducersPath, `${foldername}.js`).replace(slashReplaceExpr, '/'),
    statePath: Path.join(config.statesPath, `${foldername}.js`).replace(slashReplaceExpr, '/'),
  };
}

export async function getEntities(addEntity) {
  const files = await globAsync(Path.join(config.actionsPath, '*', '*.js'), { root: config.actionsPath });
  return files.reduce((entities, filename) => {
    const name = getName(filename);
    const entity = getEntity(name, config);
    const { [entity.namespace]: entityNamespace = {} } = entities;
    entityNamespace[entity.name] = entity;
    return { ...entities, [entity.namespace]: entityNamespace };
  }, addEntity ? { [addEntity.namespace]: { [addEntity.name]: addEntity } } : {});
}

export function flatEntities(entities) {
  const result = [];
  Object.keys(entities).forEach((namespace) => {
    Object.keys(entities[namespace]).forEach((name) => {
      result.push(entities[namespace][name]);
    });
  });
  return result;
}

export function eachEntity(entities, callback) {
  flatEntities(entities).forEach(entity => {
    callback(entity, entity.name, entity.namespace, entities);
  });
}

export function mapEntity(entities, callback) {
  return flatEntities(entities)
    .map(entity => callback(entity, entity.name, entity.namespace, entities));
}

export function reduceEntity(entities, callback, ...init) {
  return flatEntities(entities).reduce((result, entity) => callback(result, entity, entity.name, entity.namespace, entities), ...init);
}
