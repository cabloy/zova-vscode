import path from 'node:path';
import { Uri, window } from 'vscode';

import { invokeToolsMetadata, invokeZovaCli } from '../../utils/commands.js';
import { showTextDocument } from '../../utils/global.js';
import { extractCommandPathInfo, preparePathResource } from '../../utils/zova.js';

export async function initLib(resource?: Uri) {
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
  await invokeZovaCli([':init:lib', commandPathInfo.moduleName, '--nometadata'], commandPathInfo.projectCurrent);
  // metadata
  invokeToolsMetadata(commandPathInfo.moduleName, commandPathInfo.projectCurrent);
  // open
  const fileDest = path.join(commandPathInfo.moduleRoot, `src/lib/index.ts`);
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
