import * as vscode from 'vscode';
import { logger } from './utils/outputChannel.js';
import { FileWatchers } from './watchers/files.js';

let fileWatchers: FileWatchers;
export function activateExtension(context: vscode.ExtensionContext) {
  logger.log('Zova-vscode is active');

  context.subscriptions.push(
    vscode.commands.registerCommand('zova-vscode.helloWorld', () => {
      vscode.window.showInformationMessage('Hello World from zova-vscode!');
    })
  );

  fileWatchers = new FileWatchers(context);
  fileWatchers.start();
}

export function deactivateExtension() {
  if (fileWatchers) {
    fileWatchers.stop();
    fileWatchers = undefined!;
  }
}
