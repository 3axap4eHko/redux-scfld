'use strict';

import Fs from 'fs';
import Path from 'path';
import { template } from 'lodash';

import { loadedConfig as config } from './config';
import { mkDir } from './utils';
import templateOptions  from './template-options';

const typesTemplate = template(Fs.readFileSync(config.typesTemplatePath), templateOptions);

module.exports = function (entities) {
  mkDir(config.typesPath);
  const content = typesTemplate({ entities });
  Fs.writeFileSync(Path.join(config.typesPath, 'index.js'), content);
};