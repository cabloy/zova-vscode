import path from 'node:path';
import fse from 'fs-extra';
import * as vscode from 'vscode';

export function getProjectRootDirectory(): string {
  return vscode.workspace.workspaceFolders?.[0].uri.fsPath!;
}

export function isZovaProject() {
  const pathRoot = getProjectRootDirectory();
  if (!pathRoot) {
    return false;
  }
  const pathTest = path.join(getProjectRootDirectory(), 'src/boot/zova.ts');
  return fse.pathExistsSync(pathTest);
}
