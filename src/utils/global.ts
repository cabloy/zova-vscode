import * as vscode from 'vscode';

export function getProjectRootDirectory() {
  return vscode.workspace.workspaceFolders?.[0].uri.fsPath;
}
