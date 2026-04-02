import path from 'node:path';
import { Uri } from 'vscode';

import { invokeZovaCli } from '../../utils/commands.js';
import { showTextDocument } from '../../utils/global.js';
import { extractCommandPathInfo, preparePathResource } from '../../utils/zova.js';

export async function initAppMonkey(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // invoke
  await invokeZovaCli([':init:appMonkey'], commandPathInfo.projectCurrent);
  // open
  const fileDest = 'src/front/config/monkey.ts';
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}

export async function initSysMonkey(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // invoke
  await invokeZovaCli([':init:sysMonkey'], commandPathInfo.projectCurrent);
  // open
  const fileDest = 'src/front/config/monkeySys.ts';
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
