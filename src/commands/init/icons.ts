import { Uri, window } from 'vscode';
import {
  extractCommandPathInfo,
  preparePathResource,
} from '../../utils/zova.js';
import { invokeZovaCli } from '../../utils/commands.js';
import path from 'node:path';
import { showTextDocument } from '../../utils/global.js';

export async function initIcons(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  if (!commandPathInfo.moduleName) {
    return;
  }
  // invoke
  await invokeZovaCli(
    [':init:icons', commandPathInfo.moduleName],
    commandPathInfo.projectCurrent
  );
  // open
  let fileDest = path.join(
    commandPathInfo.moduleRoot,
    `icons/default/zova.svg`
  );
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
  // window.showInformationMessage('Init icons successfully!');
}
