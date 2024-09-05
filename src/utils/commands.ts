import { commands, ExtensionContext } from 'vscode';
import { createLocalBean } from '../commands/bean.js';

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
        commands.registerCommand(command, commandFunction)
      );
    }
  }
}
