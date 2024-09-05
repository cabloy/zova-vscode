import { commands, ExtensionContext } from 'vscode';
import { createLocalBean } from '../commands/bean.js';
import { logger } from './outputChannel.js';

const extensionCommands = [
  { command: 'zova.createLocalBean', function: createLocalBean },
];

export class Commands {
  context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  initialize() {
    for (const { command, function: commandFunction } of extensionCommands) {
      this.context.subscriptions.push(
        commands.registerCommand(
          command,
          wrapperCommand(command, commandFunction)
        )
      );
    }
  }
}

function wrapperCommand(command, fn) {
  return async function (...args) {
    try {
      await fn(...args);
    } catch (err) {
      logger.log(`command: ${command} Error: ${err.message}`);
    }
  };
}
