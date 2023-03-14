#! /usr/bin/env node
import { program } from 'commander';
import pkg from './package.json';
import chalk from 'chalk';
import create from './src/create';

program
  .name('cmq')
  // .description('这是一个脚手架')
  .version(
    `@cmq/cli ${pkg.version}`,
    '-v, --version',
    'output the current version!'
  )
  .usage('<command> [options]');

program
  .command('create <app-name>')
  .description('init project')
  .action((name, options) => {
    // console.log(name, options);
    create(name, options);
  });

program.on('--help', () => {
  console.log();
  console.log(
    `Run ${chalk.cyan.bold(
      'cmq <command> --help'
    )} for detailed usage of given command.`
  );
  console.log();
});

program.parse(process.argv);
