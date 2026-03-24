import path from 'node:path';
import { Uri, window, workspace } from 'vscode';

import { invokeToolsMetadata, invokeZovaCli } from '../../utils/commands.js';
import { LocalConsole } from '../../utils/console.js';
import { showTextDocument } from '../../utils/global.js';
import { combineCliResourcePath, extractCommandPathInfo, preparePathResource, trimPathPrefixs } from '../../utils/zova.js';

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
  const pathResource = trimPathPrefixs(combineCliResourcePath(commandPathInfo.pathResource, name), ['src/page/', 'src/']);
  // invoke
  await invokeZovaCli([':create:page', pathResource, `--module=${commandPathInfo.moduleName}`, '--nometadata'], commandPathInfo.projectCurrent);
  // metadata
  invokeToolsMetadata(commandPathInfo.moduleName, commandPathInfo.projectCurrent);
  // open
  const fileDest = path.join(commandPathInfo.moduleRoot, `src/page/${pathResource}/controller.tsx`);
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
