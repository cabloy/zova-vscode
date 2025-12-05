import { Uri, window, workspace } from 'vscode';
import {
  combineCliResourcePath,
  extractCommandPathInfo,
  preparePathResource,
  trimPathPrefixs,
} from '../../utils/zova.js';
import { LocalConsole } from '../../utils/console.js';
import path from 'node:path';
import { invokePnpmCli, invokeZovaCli } from '../../utils/commands.js';
import { newTerminal, showTextDocument } from '../../utils/global.js';

export async function createModule(resource?: Uri) {
  const { fromPalette, fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // name
  const name = await window.showInputBox({
    prompt: 'What is the module name?',
  });
  if (!name) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  if (fromPalette) {
    commandPathInfo.pathResource = 'src/module';
  }
  // pathResource
  const pathResource = trimPathPrefixs(
    combineCliResourcePath(commandPathInfo.pathResource, name),
    ['src/']
  );
  // invoke
  await invokeZovaCli(
    [
      ':create:module',
      pathResource,
      `--suite=${commandPathInfo.suiteName || ''}`,
    ],
    commandPathInfo.projectCurrent
  );
  // post
  _postCreateModule(commandPathInfo.projectCurrent);
  // open
  const fileDest = commandPathInfo.suiteName
    ? path.join(commandPathInfo.suiteRoot, `modules/${name}/src/index.ts`)
    : path.join(commandPathInfo.pathResource, `${name}/src/index.ts`);
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}

async function _postCreateModule(projectCurrent: string) {
  // tools.deps
  await invokeZovaCli([':tools:deps'], projectCurrent);
  // pnpm install
  // newTerminal('pnpm install', commandPathInfo.projectCurrent);
  await invokePnpmCli(['install'], projectCurrent);
}
