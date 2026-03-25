import { Uri, window } from 'vscode';

import { invokeZovaCli } from '../../utils/commands.js';
import { extractCommandPathInfo, preparePathResource } from '../../utils/zova.js';

export async function initAsset(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // scene
  const scene = await window.showInputBox({
    prompt: 'What is the asset scene name?',
  });
  if (!scene) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  if (!commandPathInfo.moduleName) {
    return;
  }
  // invoke
  await invokeZovaCli([':init:asset', scene, `--module=${commandPathInfo.moduleName}`], commandPathInfo.projectCurrent);
  // // open
  // const fileDest = path.join(commandPathInfo.moduleRoot, `static/img/vona.png`);
  // showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
}
