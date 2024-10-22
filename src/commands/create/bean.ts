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

export async function beanLocal(resource?: Uri) {
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
    [':bean:local', pathResource, `--module=${commandPathInfo.moduleName}`],
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

export async function beanModel(resource: Uri) {
  await beanGeneral_common(resource, 'model', 'What is the model bean name?');
}

export async function beanStore(resource: Uri) {
  await beanGeneral_common(resource, 'store', 'What is the store bean name?');
}

export async function beanStyle(resource: Uri) {
  await beanGeneral_common(resource, 'style', 'What is the style bean name?');
}

export async function beanTheme(resource: Uri) {
  await beanGeneral_common(resource, 'theme', 'What is the theme bean name?');
}

export async function beanTool(resource: Uri) {
  await beanGeneral_common(resource, 'tool', 'What is the tool bean name?');
}

export async function beanGeneral(resource: Uri) {
  await beanGeneral_common(
    resource,
    'general',
    'What is the general bean name?'
  );
}

export async function beanGeneral_common(
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
      `:bean:${sceneName}`,
      pathResource,
      `--module=${commandPathInfo.moduleName}`,
    ],
    commandPathInfo.projectCurrent
  );
  // open
  const prefix = sceneName === 'general' ? 'bean' : sceneName;
  const fileDest = path.join(
    commandPathInfo.moduleRoot,
    `src/bean/${prefix}.${pathResource}.ts`
  );
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
