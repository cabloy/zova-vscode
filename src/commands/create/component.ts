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
import { firstCharToUpperCase } from '../../utils/utils.js';

export async function createComponent(resource?: Uri) {
  await createComponent_common(resource, 'What is the component name?');
}

export async function createComponentFormField(resource?: Uri) {
  await createComponent_common(
    resource,
    'What is the form field component name?',
    'formField',
  );
}

export async function createComponent_common(
  resource: Uri,
  prompt: string,
  boilerplate?: string,
  name?: string,
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
  if (boilerplate && !name.startsWith(boilerplate)) {
    name = `${boilerplate}${firstCharToUpperCase(name)}`;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  if (fromPalette) {
    commandPathInfo.pathResource = '';
  }
  // pathResource
  const pathResource = trimPathPrefixs(
    combineCliResourcePath(commandPathInfo.pathResource, name),
    ['src/component/', 'src/'],
  );
  // invoke
  await invokeZovaCli(
    [
      ':create:component',
      pathResource,
      `--module=${commandPathInfo.moduleName}`,
      `--boilerplate=${boilerplate || ''}`,
    ],
    commandPathInfo.projectCurrent,
  );
  // open
  const fileDest = path.join(
    commandPathInfo.moduleRoot,
    `src/component/${pathResource}/controller.tsx`,
  );
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
