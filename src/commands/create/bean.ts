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

export async function createLocalBean(resource?: Uri) {
  const { fromPalette, fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // name
  const name = await window.showInputBox({
    prompt: 'What is the local bean name?',
  });
  if (!name) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  if (fromPalette) {
    commandPathInfo.pathResource = '';
  }
  // pathResource
  const pathResource = trimPathPrefixs(
    combineCliResourcePath(commandPathInfo.pathResource, name),
    ['src/bean/', 'src/']
  );
  // invoke
  await invokeZovaCli(
    [':create:local', pathResource, `--module=${commandPathInfo.moduleName}`],
    commandPathInfo.projectCurrent
  );
  // open
  const fileDest = pathResource.includes('/')
    ? path.join(commandPathInfo.moduleRoot, 'src', `${pathResource}.ts`)
    : path.join(
        commandPathInfo.moduleRoot,
        `src/bean/local.${pathResource}.ts`
      );
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}

export async function createModelBean(resource: Uri) {
  await createGeneralBean_common(
    resource,
    'model',
    'What is the model bean name?'
  );
}

export async function createStoreBean(resource: Uri) {
  await createGeneralBean_common(
    resource,
    'store',
    'What is the store bean name?'
  );
}

export async function createStyleBean(resource: Uri) {
  await createGeneralBean_common(
    resource,
    'style',
    'What is the style bean name?'
  );
}

export async function createThemeBean(resource: Uri) {
  await createGeneralBean_common(
    resource,
    'theme',
    'What is the theme bean name?'
  );
}

export async function createToolBean(resource: Uri) {
  await createGeneralBean_common(
    resource,
    'tool',
    'What is the tool bean name?'
  );
}

export async function createGeneralBean(resource: Uri) {
  await createGeneralBean_common(
    resource,
    'bean',
    'What is the general bean name?'
  );
}

export async function createGeneralBean_common(
  resource: Uri,
  sceneName: string,
  prompt: string
) {
  const { fromPalette, fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // name
  const name = await window.showInputBox({ prompt });
  if (!name) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  if (fromPalette) {
    commandPathInfo.pathResource = '';
  }
  // pathResource
  const pathResource = trimPathPrefixs(
    combineCliResourcePath(commandPathInfo.pathResource, name),
    ['src/bean/', 'src/']
  );
  // invoke
  await invokeZovaCli(
    [
      `:create:${sceneName}`,
      pathResource,
      `--module=${commandPathInfo.moduleName}`,
    ],
    commandPathInfo.projectCurrent
  );
  // open
  const fileDest = path.join(
    commandPathInfo.moduleRoot,
    `src/bean/${sceneName}.${pathResource}.ts`
  );
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
