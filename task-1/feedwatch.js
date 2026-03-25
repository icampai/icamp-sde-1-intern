// #!/usr/bin/env node

// import { Command } from 'commander';
// import { resolveConfig } from './lib/config.js';
// import chalk from 'chalk';
// import Table from 'cli-table3';

// const program = new Command();

// program
//   .name('feedwatch')
//   .description('CLI Feed Watcher')
//   .version('1.0.0');

// program
//   .command('config')
//   .description('Config commands')
//   .command('show')
//   .option('--retries <number>')
//   .option('--timeout <number>')
//   .option('--max-items <number>')
//   .option('--log-level <level>')
//   .action((opts) => {
//     const { config, sources } = resolveConfig({
//       retries: opts.retries && Number(opts.retries),
//       timeout: opts.timeout && Number(opts.timeout),
//       maxItems: opts.maxItems && Number(opts.maxItems),
//       logLevel: opts.logLevel,
//     });

//     const table = new Table({
//       head: ['Key', 'Value', 'Source'],
//     });

//     const colorMap = {
//       default: chalk.gray,
//       file: chalk.blue,
//       env: chalk.yellow,
//       flag: chalk.green,
//     };

//     for (const key of Object.keys(config)) {
//       table.push([
//         key,
//         config[key],
//         colorMap[sources[key]](sources[key]),
//       ]);
//     }

//     console.log(table.toString());
//   });

// program.parse();



import { Command } from 'commander';
import configCmd from './commands/config.js';
import addCmd from './commands/add.js';
import removeCmd from './commands/remove.js';
import listCmd from './commands/list.js';
import runCmd from './commands/run.js';
import readCmd from './commands/read.js';
import { resolveConfig } from './lib/config.js';

const program = new Command();

program.name('feedwatch').version('1.0.0');

program.addCommand(configCmd);
program.addCommand(addCmd);
program.addCommand(removeCmd);
program.addCommand(listCmd);
program.addCommand(runCmd);
program.addCommand(readCmd);

program.parse();