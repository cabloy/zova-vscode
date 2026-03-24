import fse from 'fs-extra';
import path from 'node:path';
import { Uri, window } from 'vscode';

import { invokeToolsMetadata, invokeZovaCli } from '../../utils/commands.js';
import { showTextDocument } from '../../utils/global.js';
import { extractCommandPathInfo, preparePathResource, trimPathPrefixs } from '../../utils/zova.js';

export async function refactorRenamePage(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
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
  const name = await window.showInputBox({
    prompt: 'What is the new page name?',
    placeHolder: parts[1],
  });
  if (!name) {
    return;
  }
  // invoke
  await invokeZovaCli(
    [':refactor:renameComponent', pathResource, name, `--module=${commandPathInfo.moduleName}`, '--nometadata'],
    commandPathInfo.projectCurrent,
  );
  // metadata
  invokeToolsMetadata(commandPathInfo.moduleName, commandPathInfo.projectCurrent);
  // open
  let fileDest = path.join(commandPathInfo.projectCurrent, commandPathInfo.moduleRoot, `src/${parts[0]}/${name}/controller.ts`);
  if (!fse.existsSync(fileDest)) {
    fileDest = `${fileDest}x`;
  }
  showTextDocument(fileDest);
}
