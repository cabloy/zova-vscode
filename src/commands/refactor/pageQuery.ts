import { Uri, window, workspace } from 'vscode';
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

export async function refactorPageQuery(resource?: Uri) {
  const { fromPalette, fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // pathResource
  let pathResource = trimPathPrefixs(commandPathInfo.pathResource, [
    'src/page/',
    'src/',
  ]);
  pathResource = pathResource.split('/')[0];
  // invoke
  await invokeZovaCli(
    [
      ':refactor:pageQuery',
      pathResource,
      `--module=${commandPathInfo.moduleName}`,
    ],
    commandPathInfo.projectCurrent
  );
  // open
  const fileDest = path.join(
    commandPathInfo.moduleRoot,
    `src/page/${pathResource}/controller.ts`
  );
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
