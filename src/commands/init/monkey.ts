import path from 'node:path';
import { Uri } from 'vscode';

import { invokeToolsMetadata, invokeZovaCli } from '../../utils/commands.js';
import { showTextDocument } from '../../utils/global.js';
import { extractCommandPathInfo, preparePathResource } from '../../utils/zova.js';

export async function initMonkey(resource?: Uri) {
  await initMonkey_common('monkey', resource);
}

export async function initMonkeySys(resource?: Uri) {
  await initMonkey_common('monkeySys', resource);
}

async function initMonkey_common(commandName: string, resource?: Uri) {
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
  await invokeZovaCli([`:init:${commandName}`, commandPathInfo.moduleName, '--nometadata'], commandPathInfo.projectCurrent);
  // metadata
  invokeToolsMetadata(commandPathInfo.moduleName, commandPathInfo.projectCurrent);
  // open
  const fileDest = path.join(commandPathInfo.moduleRoot, `src/${commandName}.ts`);
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
