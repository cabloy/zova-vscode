import * as vscode from 'vscode';

export function getProjectRootDirectory(): string {
  return vscode.workspace.workspaceFolders?.[0].uri.fsPath!;
}
