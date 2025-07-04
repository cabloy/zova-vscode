import { Uri, window } from 'vscode';
import {
  extractCommandPathInfo,
  preparePathResource,
} from '../../utils/zova.js';
import { invokeZovaCli } from '../../utils/commands.js';
import path from 'node:path';
import { showTextDocument } from '../../utils/global.js';

export async function toolsOpenapiConfig(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // invoke
  await invokeZovaCli(
    [':openapi:config', commandPathInfo.moduleName || ''],
    commandPathInfo.projectCurrent
  );
  // open
  const fileDest = commandPathInfo.moduleName
    ? path.join(commandPathInfo.moduleRoot, `cli/openapi.config.ts`)
    : `openapi.config.ts`;
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}

export async function toolsOpenapiGenerate(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // invoke
  await invokeZovaCli(
    [':openapi:generate', commandPathInfo.moduleName || ''],
    commandPathInfo.projectCurrent
  );
  // open
  const fileDest = commandPathInfo.moduleName
    ? path.join(commandPathInfo.moduleRoot, `src/api/openapi/index.ts`)
    : 'src/suite/a-home/modules/home-api/src/api/openapi/index.ts';
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
