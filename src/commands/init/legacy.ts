import path from 'node:path';
import { Uri } from 'vscode';

import { invokeZovaCli } from '../../utils/commands.js';
import { showTextDocument } from '../../utils/global.js';
import { extractCommandPathInfo, preparePathResource } from '../../utils/zova.js';

export async function initLegacy(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // invoke
  await invokeZovaCli([':init:legacy'], commandPathInfo.projectCurrent);
  // open
  const fileDest = 'src/legacy/routes.ts';
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
