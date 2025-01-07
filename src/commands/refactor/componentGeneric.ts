import { Uri, window, workspace } from 'vscode';
import fse from 'fs-extra';
import {
  combineCliResourcePath,
  extractCommandPathInfo,
  preparePathResource,
  trimPathPrefixs,
} from '../../utils/zova.js';
import { LocalConsole } from '../../utils/console.js';
import path from 'node:path';
import { invokeZovaCli } from '../../utils/commands.js';
import { showTextDocument } from '../../utils/global.js';

export async function refactorComponentGeneric(resource?: Uri) {
  const { fromPalette, fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // pathResource
  let pathResource = trimPathPrefixs(commandPathInfo.pathResource, [
    'src/component/',
    'src/',
  ]);
  pathResource = pathResource.split('/')[0];
  // invoke
  await invokeZovaCli(
    [
      ':refactor:componentGeneric',
      pathResource,
      `--module=${commandPathInfo.moduleName}`,
    ],
    commandPathInfo.projectCurrent
  );
  // open
  let fileDest = path.join(
    commandPathInfo.moduleRoot,
    `src/component/${pathResource}/controller.ts`
  );
  if (!fse.existsSync(fileDest)) {
    fileDest = `${fileDest}x`;
  }
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
