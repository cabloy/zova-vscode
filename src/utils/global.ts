import * as vscode from 'vscode';

export function newTerminal(
  command: string,
  terminalName: string = 'zova-cli',
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