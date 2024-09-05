import { ProcessHelper } from '@cabloy/process-helper';
import { Uri, window } from 'vscode';

export function createLocalBean(resource: Uri) {
  console.log(resource.fsPath);
  const processHelper = new ProcessHelper(packagePath);
  window.showInformationMessage('Hello World from zova-vscode!');
}
