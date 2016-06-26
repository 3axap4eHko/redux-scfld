'use strict';

const Fs = require('fs');
const Path = require('path');
const _ = require('lodash');

const {mkDir, relative} = require('./utils');
const templateOptions = require('./template-options');

const actionTemplate = _.template(Fs.readFileSync(Path.join(__dirname, 'templates', 'action.jst')), templateOptions);
const indexTemplate = _.template(Fs.readFileSync(Path.join(__dirname, 'templates', 'action-index.jst')), templateOptions);

module.exports = {
    createAction(entity, options, config) {
        mkDir(entity.actionFolder);
        if (Fs.existsSync(entity.actionPath) && !options.force) {
            throw new Error(`Action '${entity.fullName}' already exists`)
        }
        const content = actionTemplate(entity);
        Fs.writeFileSync(entity.actionPath, content);
    },
    generateActionsIndex(entities, config) {
        mkDir(config.paths.actions);
        const content = indexTemplate({
            entities,
            typePath: relative(config.paths.actions, config.paths.types)
        });
        Fs.writeFileSync(Path.join(config.paths.actions, 'index.js'), content);
        return entities;
    }
};