'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.mkDir = mkDir;
exports.relative = relative;
exports.join = join;
exports.getType = getType;
exports.getFilename = getFilename;
exports.getFolderName = getFolderName;
exports.getName = getName;
exports.getEntity = getEntity;
exports.getEntities = getEntities;
exports.eachEntity = eachEntity;
exports.mapEntity = mapEntity;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _lodash = require('lodash');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var slashReplaceExpr = /\\/g;
var pathSplitterExpr = /\/|\\/g;
var pathExtractExpr = /(?![A-Z])(\w)([A-Z])/g;
var nameExtractExpr = /\/([\w\-]+)\/([\w\-]+)(\.js)?$/;

function createIfNotExists(path) {
    if (!_fs2.default.existsSync(path)) {
        _fs2.default.mkdirSync(path);
    }
    return path;
}

function mkDir(path) {
    if (_fs2.default.existsSync(path)) return path;
    return path.split(pathSplitterExpr).reduce(function (path, part) {
        return createIfNotExists(_path2.default.join(path, part));
    }, '');
}

function relative(from, to) {
    return _path2.default.relative(from, to).replace(slashReplaceExpr, '/');
}

function join() {
    return _path2.default.join.apply(_path2.default, arguments).replace(slashReplaceExpr, '/');
}

function getType(actionName) {
    return actionName.replace(pathExtractExpr, '$1_$2').toUpperCase();
}

function getFilename(baseName) {
    if (_config.loadedConfig.useCamelCasedPaths) {
        return (0, _lodash.camelCase)(baseName) + '.js';
    }
    return baseName.replace(pathExtractExpr, '$1-$2').toLowerCase() + '.js';
}

function getFolderName(namespace) {
    if (_config.loadedConfig.useCamelCasedPaths) {
        return (0, _lodash.camelCase)(namespace);
    }
    return '' + namespace.replace(pathExtractExpr, '$1-$2').toLowerCase();
}

function getName(path) {
    var _path$replace$match = path.replace(slashReplaceExpr, '/').match(nameExtractExpr);

    var _path$replace$match2 = _slicedToArray(_path$replace$match, 3);

    var namespace = _path$replace$match2[1];
    var name = _path$replace$match2[2];

    return (0, _lodash.camelCase)(namespace) + ':' + (0, _lodash.camelCase)(name);
}

// test:failure
function getEntity(code) {
    var _code$split = code.split(':');

    var _code$split2 = _slicedToArray(_code$split, 2);

    var namespace = _code$split2[0];
    var name = _code$split2[1];

    var fullName = (0, _lodash.camelCase)(code);
    var foldername = getFolderName(namespace);
    var filename = getFilename(name);
    return {
        namespace: namespace,
        NAMESPACE: namespace.toUpperCase(),
        fullName: fullName,
        FullName: (0, _lodash.upperFirst)(fullName),
        name: (0, _lodash.lowerFirst)(name),
        Name: name,
        TYPE: getType(fullName),
        foldername: foldername,
        filename: filename,
        path: _path2.default.join(foldername, filename).replace(slashReplaceExpr, '/'),
        actionFolder: _path2.default.join(_config.loadedConfig.actionsPath, foldername).replace(slashReplaceExpr, '/'),
        actionPath: _path2.default.join(_config.loadedConfig.actionsPath, foldername, filename).replace(slashReplaceExpr, '/'),
        reducerFolder: _path2.default.join(_config.loadedConfig.reducersPath, foldername).replace(slashReplaceExpr, '/'),
        reducerPath: _path2.default.join(_config.loadedConfig.reducersPath, foldername, filename).replace(slashReplaceExpr, '/'),
        statePath: _path2.default.join(_config.loadedConfig.statesPath, foldername).replace(slashReplaceExpr, '/') + '.js'
    };
}

function getEntities(addEntity) {
    return _glob2.default.sync(_path2.default.join(_config.loadedConfig.actionsPath, '*', '*.js'), { root: _config.loadedConfig.actionsPath }).reduce(function (entities, filename) {
        var name = getName(filename);
        var entity = getEntity(name, _config.loadedConfig);
        if (!entities[entity.namespace]) {
            entities[entity.namespace] = {};
        }
        entities[entity.namespace][entity.name] = entity;
        return entities;
    }, addEntity ? _defineProperty({}, addEntity.namespace, _defineProperty({}, addEntity.name, addEntity)) : {});
}

function eachEntity(entities, callback) {
    Object.keys(entities).forEach(function (namespace) {
        Object.keys(entities[namespace]).forEach(function (name) {
            callback(entities[namespace][name], name, namespace, entities);
        });
    });
}

function mapEntity(entities, callback) {
    return Object.keys(entities).reduce(function (result, namespace) {
        return result.concat(Object.keys(entities[namespace]).map(function (name) {
            return callback(entities[namespace][name], name, namespace, entities);
        }));
    }, []);
}