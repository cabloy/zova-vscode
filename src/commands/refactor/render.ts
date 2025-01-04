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

export async function refactorAnotherRender(resource?: Uri) {
  const { fromPalette, fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // name
  let name = await window.showInputBox({
    prompt: 'What is the render bean name?',
    placeHolder: 'renderXXX',
  });
  if (!name) {
    return;
  }
  if (!name.startsWith('render')) {
    name = 'render' + firstCharToUpperCase(name);
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // pathResource
  let pathResource = trimPathPrefixs(commandPathInfo.pathResource, ['src/']);
  pathResource = pathResource.split('/').slice(0, 2).join('/');
  // invoke
  await invokeZovaCli(
    [
      ':refactor:anotherRender',
      pathResource,
      name,
      `--module=${commandPathInfo.moduleName}`,
    ],
    commandPathInfo.projectCurrent
  );
  // open
  const fileDest = path.join(
    commandPathInfo.moduleRoot,
    `src/${pathResource}/${name}.tsx`
  );
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
