#!/usr/bin/env node

import * as program from 'commander';
import * as is from 'is_js';
import * as readline from 'readline';
import {Writable} from 'stream';
import multisigAll from './index';

const cosignCommand = program
  .command('co-sign')
  .usage('--node http://testnet.lisk.io:7000 --msidaddress 1234567890L')
  .option('--node <nodeAddress>', 'Node Address')
  .option('--msigaddress <address>', 'Multisig address');
cosignCommand
  .action(async (options) => {
    if (is.empty(options.node)) {
      console.error('Node address is not defined');
      cosignCommand.outputHelp();
      process.exit(1);
    } else if (!/http(s)?:\/\/[^\/]+/.test(options.node)) {
      console.error('Node address should be defined in this format: https://host:port without trailing slash');
      cosignCommand.outputHelp();
      process.exit(1);
    } else if (options.node.endsWith('/')) {
      console.error('Node address should be defined in this format: https://host:port without trailing slash');
      cosignCommand.outputHelp();
      process.exit(1);
    }

    if (is.empty(options.msigaddress)) {
      console.error('Please specify multi sig address');
      cosignCommand.outputHelp();
      process.exit(1);
    }


    await multisigAll(options.node, options.msigaddress, async () => await readSecret(`Enter cosigning secret: `));

  });

function readSecret(question: string) {
  let muted = false;
  const mutableStdout = new Writable({
    write: function(chunk, encoding, callback) {
      if (!muted) {
        process.stdout.write(<any> chunk, encoding);
      }
      callback();
    }
  });

  const rl = readline.createInterface({
    input   : process.stdin,
    output  : mutableStdout,
    terminal: true
  });

  return new Promise<string>(resolve => {
    rl.question(question, line => {
      rl.close();
      resolve(line);
    });
    muted = true;
  });
}

program.on('*', function () {
  cosignCommand.outputHelp();
});

program.parse(process.argv);

if (program.args.length < 1) {
  cosignCommand.outputHelp();
}