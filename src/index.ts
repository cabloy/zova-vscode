import * as vscode from 'vscode';
import { hasZovaProject, isZovaProject } from './utils/zova.js';
import { activateExtension, deactivateExtension } from './extension.js';

export async function activate(context: vscode.ExtensionContext) {
  const projectInfo = await hasZovaProject();
  vscode.commands.executeCommand(
    'setContext',
    'zova.hasZovaProject',
    !!projectInfo
  );
  if (projectInfo && !projectInfo.isMulti) {
    vscode.commands.executeCommand(
      'setContext',
      'zova.currentZovaProject',
      projectInfo.directoryCurrent
    );
  }
  if (projectInfo) {
    activateExtension(context);
  }
}

export function deactivate() {
  deactivateExtension();
}
