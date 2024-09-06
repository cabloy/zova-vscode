import { Uri, window, workspace } from 'vscode';
import {
  combineCliResourcePath,
  extractCommandPathInfo,
  trimPathPrefixs,
} from '../utils/zova.js';
import { LocalConsole } from '../utils/console.js';
import path from 'node:path';
import { invokeZovaCli } from '../utils/commands.js';
import { showTextDocument } from '../utils/global.js';

export async function createLocalBean(resource: Uri) {
  // name
  const name = await window.showInputBox({
    prompt: 'What is the local bean name?',
  });
  if (!name) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(resource.fsPath);
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
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
