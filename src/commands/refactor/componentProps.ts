import fse from 'fs-extra';
import path from 'node:path';
import { Uri } from 'vscode';

import { invokeToolsMetadata, invokeZovaCli } from '../../utils/commands.js';
import { showTextDocument } from '../../utils/global.js';
import { extractCommandPathInfo, preparePathResource, trimPathPrefixs } from '../../utils/zova.js';

export async function refactorComponentProps(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // pathResource
  let pathResource = trimPathPrefixs(commandPathInfo.pathResource, ['src/component/', 'src/']);
  pathResource = pathResource.split('/')[0];
  // invoke
  await invokeZovaCli(
    [':refactor:componentProps', pathResource, `--module=${commandPathInfo.moduleName}`, '--nometadata'],
    commandPathInfo.projectCurrent,
  );
  // metadata
  invokeToolsMetadata(commandPathInfo.moduleName, commandPathInfo.projectCurrent);
  // open
  let fileDest = path.join(commandPathInfo.projectCurrent, commandPathInfo.moduleRoot, `src/component/${pathResource}/controller.ts`);
  if (!fse.existsSync(fileDest)) {
    fileDest = `${fileDest}x`;
  }
  showTextDocument(fileDest);
}
