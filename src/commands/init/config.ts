import { Uri, window } from 'vscode';
import {
  extractCommandPathInfo,
  preparePathResource,
} from '../../utils/zova.js';
import { invokeZovaCli } from '../../utils/commands.js';
import path from 'node:path';
import { showTextDocument } from '../../utils/global.js';

export async function initConfig(resource?: Uri) {
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
    [':init:config', commandPathInfo.moduleName],
    commandPathInfo.projectCurrent
  );
  // open
  let fileDest = path.join(commandPathInfo.moduleRoot, `src/config/config.ts`);
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
