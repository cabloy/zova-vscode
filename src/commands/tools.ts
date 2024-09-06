import { Uri, window } from 'vscode';
import { extractCommandPathInfo, preparePathResource } from '../utils/zova.js';
import { invokeZovaCli } from '../utils/commands.js';

export async function toolsIcons(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  if (!commandPathInfo.moduleName) {
    return;
  }
  // invoke
  await invokeZovaCli(
    [':tools:icons', commandPathInfo.moduleName],
    commandPathInfo.projectCurrent
  );
  window.showInformationMessage('Generate icons successfully!');
}

export async function toolsRes(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  if (!commandPathInfo.moduleName) {
    return;
  }
  // invoke
  await invokeZovaCli(
    [':tools:res', commandPathInfo.moduleName],
    commandPathInfo.projectCurrent
  );
  window.showInformationMessage('Generate .res successfully!');
}
