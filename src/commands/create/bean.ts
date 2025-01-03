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
  await beanGeneral_common(resource, 'local', 'What is the local bean name?');
}

export async function beanModel(resource: Uri) {
  await beanGeneral_common(resource, 'model', 'What is the model bean name?');
}

export async function beanStore(resource: Uri) {
  await beanGeneral_common(resource, 'store', 'What is the store bean name?');
}

export async function beanCss(resource: Uri) {
  await beanGeneral_common(resource, 'css', 'What is the css bean name?');
}

export async function beanTheme(resource: Uri) {
  await beanGeneral_common(resource, 'theme', 'What is the theme bean name?');
}

export async function beanTool(resource: Uri) {
  await beanGeneral_common(resource, 'tool', 'What is the tool bean name?');
}

export async function beanGeneral(resource: Uri) {
  await beanGeneral_common(resource, 'bean', 'What is the general bean name?');
}

export async function beanService(resource: Uri) {
  await beanGeneral_common(
    resource,
    'service',
    'What is the service bean name?'
  );
}

export async function beanMetaThemeHandler(resource: Uri) {
  await beanGeneral_common(
    resource,
    'meta',
    'What is the meta themeHandler bean name?',
    'themeHandler'
  );
}

export async function beanGeneral_common(
  resource: Uri,
  sceneName: string,
  prompt: string,
  name?: string
) {
  const { fromPalette, fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // name
  if (!name) {
    name = await window.showInputBox({ prompt });
    if (!name) {
      return;
    }
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  if (fromPalette) {
    commandPathInfo.pathResource = '';
  }
  // pathResource
  const pathResource = trimPathPrefixs(
    combineCliResourcePath(commandPathInfo.pathResource, name),
    [`src/${sceneName}/`, 'src/bean/', 'src/']
  );
  // invoke
  await invokeZovaCli(
    [
      `:create:bean`,
      sceneName,
      pathResource,
      `--module=${commandPathInfo.moduleName}`,
    ],
    commandPathInfo.projectCurrent
  );
  // open
  let fileDest: string;
  if (pathResource.includes('/')) {
    fileDest = path.join(
      commandPathInfo.moduleRoot,
      'src',
      `${pathResource}.ts`
    );
  } else {
    const fileDestScene = ['service'].includes(sceneName)
      ? `src/${sceneName}/${pathResource}.ts`
      : `src/bean/${sceneName}.${pathResource}.ts`;
    fileDest = path.join(commandPathInfo.moduleRoot, fileDestScene);
  }
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
