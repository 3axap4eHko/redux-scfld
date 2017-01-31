import Fs from 'fs';
import { resolve, join, basename, relative } from 'path';
import Glob from 'glob';
import commander from 'commander';
import { createAction, generateActionsIndex } from './action';
import generateTypes from './types';
import { createReducer, generateReducersIndex } from './reducer';
import { createState, generateStatesIndex } from './state';
import { getEntity, getEntities, eachEntity, mkDir } from './utils';
import { defaultConfig, loadedConfig } from './config';

const { version } = JSON.parse(Fs.readFileSync(join(__dirname, './package.json'), 'utf8'));

commander
  .version(version)
  .usage('[options] <command>');

commander
  .command('init')
  .alias('i')
  .description('Generate Redux-Scfld config file .reduxrc')
  .option('-t, --templates', 'add templates section to the config file')
  .action(({ templates }) => {
    const baseConfig = {
      useCamelCasedPaths: false,
      actionsPath: './app/actions',
      reducersPath: './app/reducers',
      typesPath: './app/types',
      statesPath: './app/states',
    };
    if (templates) {
      Fs.writeFileSync('.reduxrc', JSON.stringify({ ...defaultConfig, ...baseConfig }, null, '  '));
    } else {
      Fs.writeFileSync('.reduxrc', JSON.stringify(baseConfig, null, '  '));
    }
  });

commander
  .command('create <entity> [entities...]')
  .alias('c')
  .description('Creates entities with Action, Type and Reducer and generates their indexes')
  .option('-f, --force', 'Force creation entity')
  .action((name, names, options) => {
    [name].concat(names).forEach((entityName) => {
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
  });

commander
  .command('config')
  .alias('cfg')
  .description('Display current config')
  .action(() => {
    console.log(JSON.stringify(loadedConfig, null, '  '));
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

commander
  .command('templates <dir>')
  .alias('tpl')
  .description('Generate templates in target directory')
  .action((dir) => {
    const targetDir = relative(process.cwd(), resolve(process.cwd(), dir));
    mkDir(targetDir);
    Glob.sync(join(__dirname, 'templates/*.jst')).forEach((filepath) => {
      const filename = join(targetDir, basename(filepath));
      Fs.createReadStream(filepath)
        .pipe(Fs.createWriteStream(filename));
    });
  });


commander.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ redux init --templates');
  console.log('    $ redux create app:load app:save app:reset');
  console.log('    $ redux ls');
  console.log('');
});

commander.parse(process.argv);


if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
