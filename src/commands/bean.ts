import { ProcessHelper } from '@cabloy/process-helper';
import { Uri, window, workspace } from 'vscode';
import {
  combineCliResourcePath,
  extractCommandPathInfo,
  getWorkspaceRootDirectory,
  getZovaProjectCurrent,
  trimPathPrefixs,
} from '../utils/zova.js';
import { LocalConsole } from '../utils/console.js';
import path from 'node:path';
import { invokeZovaCli } from '../utils/commands.js';

export async function createLocalBean(resource: Uri) {
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(resource.fsPath);
  // name
  const name = await window.showInputBox({
    prompt: 'What is the local bean name?',
  });
  if (!name) {
    return;
  }
  // pathResource
  const pathResource = trimPathPrefixs(
    combineCliResourcePath(commandPathInfo.pathResource, name),
    ['src/bean/', 'src/']
  );
  // invoke
  await invokeZovaCli(
    [':create:local', pathResource, `--module=${commandPathInfo.moduleName}`],
    commandPathInfo.projectCurrent
  );
  // open
  let fileDest = pathResource.includes('/')
    ? path.join(commandPathInfo.moduleRoot, 'src', `${pathResource}.ts`)
    : path.join(
        commandPathInfo.moduleRoot,
        `src/bean/local.${pathResource}.ts`
      );
  const doc = await workspace.openTextDocument(
    Uri.file(path.join(commandPathInfo.projectCurrent, fileDest))
  );
  window.showTextDocument(doc);
}
