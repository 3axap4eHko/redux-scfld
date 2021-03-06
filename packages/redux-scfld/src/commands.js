import commander from 'commander';
import * as Api from './api';
import { version } from '../package.json';

commander
  .version(version)
  .usage('[options] <command>');

commander
  .command('init <path>')
  .alias('i')
  .description('Generate Redux-Scfld config file .reduxrc')
  .action((path) => Api.init(path));

commander
  .command('add <entity> [entities...]')
  .alias('a')
  .description('Adds entities with Action, Type and Reducer and generates their indexes')
  .option('-f, --force', 'Force creation entity')
  .action((name, names = [], options) => Api.add([name].concat(names), options));

commander
  .command('del <entity> [entities...]')
  .alias('d')
  .description('Deletes entities with Action, Type and Reducer and re-generates their indexes')
  .action((name, names = [], options) => Api.del([name].concat(names), options));

commander
  .command('config')
  .alias('cfg')
  .description('Display current config')
  .action(() => Api.config());

commander
  .command('sync')
  .alias('s')
  .description('Sync actions, states and types')
  .action(() => Api.sync());

commander
  .command('list')
  .alias('ls')
  .description('List all entities')
  .action(() => Api.list());

commander
  .command('namespaces')
  .alias('ns')
  .description('List all namespaces')
  .action(() => Api.namespaces());

commander
  .command('types')
  .alias('t')
  .description('List all types')
  .action(() => Api.types());

commander
  .command('*')
  .action(() => {
    commander.outputHelp();
  });

commander.on('-v', () => {
  console.log(version);
});

commander.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log(' redux init app/redux');
  console.log(' redux add app:load app:save app:reset');
  console.log(' redux del app:* config:load');
  console.log(' redux namespaces');
  console.log(' redux ls');
  console.log('');
});

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
