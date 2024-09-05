import { ProcessHelper } from '@cabloy/process-helper';
import { Uri, window } from 'vscode';
import {
  combineCliResourcePath,
  extractCommandPathInfo,
  getWorkspaceRootDirectory,
  getZovaProjectCurrent,
} from '../utils/zova.js';
import { LocalConsole } from '../utils/console.js';
import path from 'node:path';
import { invokeZovaCli } from '../utils/commands.js';

export async function createLocalBean(resource: Uri) {
  const commandPathInfo = extractCommandPathInfo(resource.fsPath);
  console.log(commandPathInfo);
  const name = await window.showInputBox({
    prompt: 'What is the local bean name?',
  });
  if (!name) {
    return;
  }
  await invokeZovaCli(
    [
      ':create:local',
      combineCliResourcePath(commandPathInfo.pathResource, name),
      `--module=${commandPathInfo.moduleName}`,
    ],
    commandPathInfo.projectCurrent
  );
}
