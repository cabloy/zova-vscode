import * as vscode from 'vscode';
import { logger } from './utils/outputChannel.js';

export function activateExtension(context: vscode.ExtensionContext) {
  logger.log('Zova-vscode is active');

  context.subscriptions.push(
    vscode.commands.registerCommand('zova-vscode.helloWorld', () => {
      vscode.window.showInformationMessage('Hello World from zova-vscode!');
    })
  );
}

export function deactivateExtension() {}
