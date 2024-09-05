import { Uri, window } from 'vscode';

export function createLocalBean(resource: Uri) {
  console.log(resource.fsPath);
  window.showInformationMessage('Hello World from zova-vscode!');
}
