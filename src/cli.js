import Fs from 'fs';
import {resolve} from 'path';
import commander from 'commander';
import {createAction, generateActionsIndex} from './action';
import generateTypes from './types';
import {createReducer, generateReducersIndex} from './reducer';
import {createState, generateStatesIndex} from './state';
import {getEntity, getEntities, eachEntity} from './utils';
import {defaultConfig} from './config';

const {version} = JSON.parse(Fs.readFileSync(resolve(__dirname, './package.json'), 'utf8'));

commander
  .version(version)
  .usage('[options] <command>');

commander
  .command('config')
  .alias('cfg')
  .description('Generate Redux-Scfld config file .reduxrc')
  .option('-t, --templates', 'add templates section to the config file')
  .action(({templates}) => {
    const baseConfig = {
      useCamelCasedPaths: false,
      actionsPath: './app/actions',
      reducersPath: './app/reducers',
      typesPath: './app/types',
      statesPath: './app/states'
    };
    if (templates) {
      Fs.writeFileSync('.reduxrc', JSON.stringify({...defaultConfig, ...baseConfig}, null, '  '))
    } else {
      Fs.writeFileSync('.reduxrc', JSON.stringify(baseConfig, null, '  '))
    }
  });

commander
  .command('create <entity name>')
  .alias('c')
  .description('Create new entity (namespace:entity)')
  .option('-f, --force', 'Force creation entity')
  .action((entityName, options) => {
    const entity = getEntity(entityName);
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
  });

commander
  .command('gen')
  .alias('g')
  .description('Generate indexes for actions, reducers, states and types')
  .action(() => {
    const entities = getEntities();
    generateActionsIndex(entities);
    console.log('[Redux] Actions index generated');
    generateTypes(entities);
    console.log('[Redux] Types index generated');
    generateReducersIndex(entities);
    console.log('[Redux] Reducers index generated');
    generateStatesIndex(entities);
    console.log('[Redux] States index generated');
  });

commander
  .command('list')
  .alias('ls')
  .description('List all entities')
  .action(() => {
    const entities = getEntities();
    eachEntity(entities, entity => console.log(`${entity.fullName}`));
  });

commander
  .command('namespaces')
  .alias('ns')
  .description('List all namespaces')
  .action(() => {
    const entities = getEntities();
    Object.keys(entities).forEach(namespace => console.log(`${namespace}`));
  });

commander
  .command('types')
  .alias('t')
  .description('List all types')
  .action(() => {
    const entities = getEntities();
    eachEntity(entities, entity => console.log(`${entity.TYPE}`));
  });


commander.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ custom-help --help');
  console.log('    $ custom-help -h');
  console.log('');
});

commander.parse(process.argv);


if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
