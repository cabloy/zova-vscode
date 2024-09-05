import * as vscode from 'vscode';
import { hasZovaProject, isZovaProject } from './utils/zova.js';
import { activateExtension, deactivateExtension } from './extension.js';
import { ContextKeys } from './utils/contextKeys.js';

export async function activate(context: vscode.ExtensionContext) {
  const contextKeys = new ContextKeys();
  const projectInfo = await contextKeys.initialize();
  if (projectInfo) {
    activateExtension(context);
  }
}

export function deactivate() {
  deactivateExtension();
}
