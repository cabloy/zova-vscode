import path from 'node:path';
import { Uri, window } from 'vscode';

import { invokeToolsMetadata, invokeZovaCli } from '../../utils/commands.js';
import { showTextDocument } from '../../utils/global.js';
import { combineCliResourcePath, extractCommandPathInfo, preparePathResource, trimPathPrefixs } from '../../utils/zova.js';

export async function createComponent(resource?: Uri) {
  await createComponent_common(resource, 'What is the component name?');
}

export async function createComponentFormField(resource?: Uri) {
  await createComponent_common(resource, 'What is the form field component name?', 'formField');
}

export async function createComponentBlockPage(resource?: Uri) {
  await createComponent_common(resource, 'What is the page block component name?', 'blockPage');
}

export async function createComponentBlockPageEntry(resource?: Uri) {
  await createComponent_common(resource, 'What is the page entry block component name?', 'blockPageEntry');
}

export async function createComponentFormAction(resource?: Uri) {
  await createComponent_common(resource, 'What is the form action component name?', 'actionRow');
}

export async function createComponentTableActionBulk(resource?: Uri) {
  await createComponent_common(resource, 'What is the table action bulk component name?', 'actionBulk');
}

export async function createComponent_common(resource: Uri, prompt: string, boilerplate?: string, name?: string) {
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
  // need not append prefix for boilerplate
  // if (boilerplate && !name.startsWith(boilerplate)) {
  //   name = `${boilerplate}${firstCharToUpperCase(name)}`;
  // }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  if (fromPalette) {
    commandPathInfo.pathResource = '';
  }
  // pathResource
  const pathResource = trimPathPrefixs(combineCliResourcePath(commandPathInfo.pathResource, name), ['src/component/', 'src/']);
  // invoke
  await invokeZovaCli(
    [':create:component', pathResource, `--module=${commandPathInfo.moduleName}`, `--boilerplate=${boilerplate || ''}`, '--nometadata'],
    commandPathInfo.projectCurrent,
  );
  // metadata
  invokeToolsMetadata(commandPathInfo.moduleName, commandPathInfo.projectCurrent);
  // open
  const fileDest = path.join(commandPathInfo.moduleRoot, `src/component/${pathResource}/controller.tsx`);
  showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
