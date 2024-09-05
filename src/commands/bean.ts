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
  const commandPathInfo = extractCommandPathInfo(resource.fsPath);
  console.log(commandPathInfo);
  const name = await window.showInputBox({
    prompt: 'What is the local bean name?',
  });
  if (!name) {
    return;
  }
  //
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
  workspace
    .openTextDocument(
      Uri.file(path.join(commandPathInfo.projectCurrent, fileDest))
    )
    .then((doc) => {
      window.showTextDocument(doc);
    });
}
