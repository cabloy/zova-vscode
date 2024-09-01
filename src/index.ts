import * as vscode from 'vscode';
import { isZovaProject } from './utils/zova.js';
import { activateExtension, deactivateExtension } from './extension.js';

export function activate(context: vscode.ExtensionContext) {
  const isZova = isZovaProject();
  vscode.commands.executeCommand('setContext', 'zova.isZovaProject', isZova);
  if (isZova) {
    activateExtension(context);
  }
}

export function deactivate() {
  deactivateExtension();
}
