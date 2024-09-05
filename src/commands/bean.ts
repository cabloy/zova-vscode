import { ProcessHelper } from '@cabloy/process-helper';
import { Uri, window } from 'vscode';
import {
  getWorkspaceRootDirectory,
  getZovaProjectCurrent,
} from '../utils/zova.js';
import { LocalConsole } from '../utils/console.js';
import path from 'node:path';
import { invokeZovaCli } from '../utils/commands.js';

export async function createLocalBean(resource: Uri) {
  const projectCurrent = getZovaProjectCurrent(resource.fsPath);
  await invokeZovaCli(
    [':create:bean', 'test3', '--module=test-demo'],
    projectCurrent
  );
  window.showInformationMessage('Hello World from zova-vscode!');
}
