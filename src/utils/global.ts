import * as vscode from 'vscode';

export function getProjectRootDirectory(): string {
  return vscode.workspace.workspaceFolders?.[0].uri.fsPath!;
}

export function newTerminal(
  terminalName: string,
  command: string,
  cwd?: string
) {
  const existingTerminal = vscode.window.terminals.find(
    (terminal) => terminal.name === terminalName
  );

  if (existingTerminal) {
    existingTerminal.show();
    existingTerminal.sendText(command);
  } else {
    const terminal = vscode.window.createTerminal({
      name: terminalName,
      cwd,
    });
    terminal.sendText(command);
    terminal.show();
  }
}
