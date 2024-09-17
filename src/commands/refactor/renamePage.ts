import { Uri, window, workspace } from 'vscode';
import {
  combineCliResourcePath,
  extractCommandPathInfo,
  preparePathResource,
  trimPathPrefixs,
} from '../../utils/zova.js';
import { LocalConsole } from '../../utils/console.js';
import path from 'node:path';
import { invokeZovaCli } from '../../utils/commands.js';
import { showTextDocument } from '../../utils/global.js';
import { firstCharToUpperCase } from '../../utils/utils.js';

export async function refactorRenamePage(resource?: Uri) {
  const { fromPalette, fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // pathResource
  let pathResource = trimPathPrefixs(commandPathInfo.pathResource, ['src/']);
  const parts = pathResource.split('/').slice(0, 2);
  pathResource = parts.join('/');
  // name
  let name = await window.showInputBox({
    prompt: 'What is the new page name?',
    placeHolder: parts[1],
  });
  if (!name) {
    return;
  }
  // invoke
  await invokeZovaCli(
    [
      ':refactor:renameComponent',
      pathResource,
      name,
      `--module=${commandPathInfo.moduleName}`,
    ],
    commandPathInfo.projectCurrent
  );
  // open
  const fileDest = path.join(
    commandPathInfo.moduleRoot,
    `src/${parts[0]}/${name}/controller.ts`
  );
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
