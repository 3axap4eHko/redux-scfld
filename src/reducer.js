'use strict';

const Fs = require('fs');
const Path = require('path');
const _ = require('lodash');
const {mkDir, relative} = require('./utils');
const templateOptions = require('./template-options');

const reducerTemplate = _.template(Fs.readFileSync(Path.join(__dirname, 'templates', 'reducer.jst')), templateOptions);
const indexTemplate = _.template(Fs.readFileSync(Path.join(__dirname, 'templates', 'reducer-index.jst')), templateOptions);

module.exports = {
    createReducer(entity, options, config) {
        mkDir(entity.reducerFolder);
        if (Fs.existsSync(entity.reducerPath) && !options.force) {
            throw new Error(`Reducer '${entity.fullName}' already exists`)
        }
        const content = reducerTemplate({
            entity,
            typesPath: relative(entity.reducerFolder, config.paths.types)
        });
        Fs.writeFileSync(entity.reducerPath, content);
    },
    generateReducersIndex(entities, config) {
        const content = indexTemplate({
            entities,
            typePath: relative(config.paths.reducers, config.paths.types),
            defaultState: config.defaultState ? relative(config.paths.reducers, config.defaultState) : false
        });
        Fs.writeFileSync(Path.join(config.paths.reducers, 'index.js'), content);
    }
}