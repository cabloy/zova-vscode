import { Uri, window } from 'vscode';
import {
  extractCommandPathInfo,
  preparePathResource,
} from '../../utils/zova.js';
import { invokeZovaCli } from '../../utils/commands.js';
import path from 'node:path';
import { showTextDocument } from '../../utils/global.js';

export async function initMain(resource?: Uri) {
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
    [':init:main', commandPathInfo.moduleName],
    commandPathInfo.projectCurrent
  );
  // open
  const fileDest = path.join(commandPathInfo.moduleRoot, `src/main.ts`);
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}