import * as vscode from 'vscode';
import { logger } from './utils/outputChannel.js';
import { FileWatchers } from './watchers/files.js';
import { TextEditorWatchers } from './watchers/textEditor.js';

let fileWatchers: FileWatchers | undefined;
let textEditorWatchers: TextEditorWatchers | undefined;
export function activateExtension(context: vscode.ExtensionContext) {
  logger.log('Zova-vscode is active');

  context.subscriptions.push(
    vscode.commands.registerCommand('zova-vscode.helloWorld', () => {
      vscode.window.showInformationMessage('Hello World from zova-vscode!');
    })
  );

  textEditorWatchers = new TextEditorWatchers(context);

  fileWatchers = new FileWatchers(context);
  fileWatchers.start();
}

export function deactivateExtension() {
  if (textEditorWatchers) {
    textEditorWatchers.stop();
    textEditorWatchers = undefined;
  }
  if (fileWatchers) {
    fileWatchers.stop();
    fileWatchers = undefined;
  }
}
