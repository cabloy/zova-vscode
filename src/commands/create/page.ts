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

export async function createPage(resource?: Uri) {
  const { fromPalette, fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // name
  const name = await window.showInputBox({
    prompt: 'What is the page name?',
  });
  if (!name) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  if (fromPalette) {
    commandPathInfo.pathResource = '';
  }
  // pathResource
  const pathResource = trimPathPrefixs(
    combineCliResourcePath(commandPathInfo.pathResource, name),
    ['src/page/', 'src/']
  );
  // invoke
  await invokeZovaCli(
    [':create:page', pathResource, `--module=${commandPathInfo.moduleName}`],
    commandPathInfo.projectCurrent
  );
  // open
  const fileDest = path.join(
    commandPathInfo.moduleRoot,
    `src/page/${pathResource}/controller.ts`
  );
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
