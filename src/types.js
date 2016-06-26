'use strict';

const Fs = require('fs');
const Path = require('path');
const _ = require('lodash');
const {mkDir} = require('./utils');
const templateOptions = require('./template-options');

const typesTemplate = _.template(Fs.readFileSync(Path.join(__dirname, 'templates', 'types.jst')), templateOptions);


module.exports = function (entities, options, config) {
    mkDir(config.paths.types);
    const content = typesTemplate({entities});
    Fs.writeFileSync(Path.join(config.paths.types, 'index.js'), content);
};