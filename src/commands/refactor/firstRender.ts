import path from 'node:path';
import { Uri } from 'vscode';

import { invokeToolsMetadata, invokeZovaCli } from '../../utils/commands.js';
import { showTextDocument } from '../../utils/global.js';
import { extractCommandPathInfo, preparePathResource, trimPathPrefixs } from '../../utils/zova.js';

export async function refactorFirstRender(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // pathResource
  let pathResource = trimPathPrefixs(commandPathInfo.pathResource, ['src/']);
  pathResource = pathResource.split('/').slice(0, 2).join('/');
  // invoke
  await invokeZovaCli(
    [':refactor:firstRender', pathResource, `--module=${commandPathInfo.moduleName}`, '--nometadata'],
    commandPathInfo.projectCurrent,
  );
  // metadata
  invokeToolsMetadata(commandPathInfo.moduleName, commandPathInfo.projectCurrent);
  // open
  const fileDest = path.join(commandPathInfo.moduleRoot, `src/${pathResource}/render.tsx`);
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
