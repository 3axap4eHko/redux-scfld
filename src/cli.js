import Fs from 'fs';
import { createAction, generateActionsIndex } from './action';
import generateTypes from './types';
import { createReducer, generateReducersIndex } from './reducer';
import { createState, generateStatesIndex } from './state';
import { getEntity, getEntities, eachEntity } from './utils';
import { defaultConfig } from './config';

const [command, ...args] = process.argv.slice(2);

const argFlagExpr = /^--(\w+)$/;
const argFlagShortExpr = /^-(\w+)$/;
const argFlagValueExpr = /^--(\w+)=(.+)$/;
const argFlagNamesExpr = /^([\w:_]+)$/;

const optionsMap = {
  f: 'force',
  t: 'templates',
};

function parseArgFlag(options, arg) {
  const matches = arg.match(argFlagExpr);
  if (matches) {
    options[matches[1]] = true;
    return true;
  }
  return false;
}

function parseArgShortFlag(options, arg) {
  const matches = arg.match(argFlagShortExpr);
  if (matches) {
    Array.from(matches[1]).map(o => optionsMap[o]).forEach(name => {
      options[name] = true;
    });
    return true;
  }
  return false;
}

function parseArgValueFlag(options, arg) {
  const matches = arg.match(argFlagValueExpr);
  if (matches) {
    options[matches[1]] = matches[2];
    return true;
  }
  return false;
}

function parseArgIdxFlag(options, arg, idx) {
  const matches = arg.match(argFlagNamesExpr);
  if (matches) {
    options[idx] = matches[1];
    return true;
  }
  return false;
}

const parsers = [parseArgFlag, parseArgShortFlag, parseArgValueFlag, parseArgIdxFlag];
const options = args.reduce((options, arg, idx) => {
  if (!parsers.some(parser => parser(options, arg, idx))) {
    throw new Error(`Unexpected argument: '${arg}'`);
  }
  return options;
}, {});

const commands = {
  help() {
    console.log('React Redux Scaffold');
    console.log('redux [command] [options]');
    console.log('commands:');
    console.log('config [-t]                        init config (use -t arg to add templates sections )');
    console.log('create [actionName] [-f|--force]   creates action, reducer and type');
    console.log('update                             updates index files of actions, reducers and types');
    console.log('ls                                 list of entities');
    console.log('ns                                 list of namespaces');
    console.log('types                              list types');
    console.log('\t options:');
    console.log('-f, --force  force action');
  },
  config() {
    var baseConfig = {
      useCamelCasedPaths: false,
      actionsPath: './app/actions',
      reducersPath: './app/reducers',
      typesPath: './app/types',
      statesPath: './app/states'
    };
    if (options.templates) {
      baseConfig = Object.assign({}, defaultConfig, baseConfig);
    }
    Fs.writeFileSync('.reduxrc', JSON.stringify(baseConfig, null, '  '))
  },
  create(options) {
    const entity = getEntity(options[0]);
    const entities = getEntities(entity);
    createAction(entity, options);
    generateActionsIndex(entities);
    console.log(`[Redux] Action created: ${entity.fullName}`);
    generateTypes(entities, options);
    console.log(`[Redux] Type created: ${entity.TYPE}`);
    createReducer(entity, options);
    generateReducersIndex(entities);
    console.log(`[Redux] Reducer created: ${entity.fullName}`);
    createState(entity, options);
    generateStatesIndex(entities);
    console.log(`[Redux] State created: ${entity.namespace}`);
  },
  update() {
    const entities = getEntities();
    generateActionsIndex(entities);
    console.log('[Redux] Actions index generated');
    generateTypes(entities);
    console.log('[Redux] Types index generated');
    generateReducersIndex(entities);
    console.log('[Redux] Reducers index generated');
    generateStatesIndex(entities);
    console.log('[Redux] States index generated');
  },
  ls() {
    const entities = getEntities();
    eachEntity(entities, entity => console.log(`${entity.fullName}`));
  },
  ns() {
    const entities = getEntities();
    Object.keys(entities).forEach(namespace => console.log(`${namespace}`));
  },
  types() {
    const entities = getEntities();
    eachEntity(entities, entity => console.log(`${entity.TYPE}`));
  }
};

if (!commands[command]) {
  commands.help(options);
} else {
  commands[command](options);
}
