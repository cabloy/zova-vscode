import path from 'node:path';
import { Uri, window } from 'vscode';

import { invokeZovaCli } from '../../utils/commands.js';
import { showTextDocument } from '../../utils/global.js';
import { extractCommandPathInfo, preparePathResource } from '../../utils/zova.js';

// export async function toolsIcon(resource?: Uri) {
//   const { fsPath } = preparePathResource(resource);
//   if (!fsPath) {
//     return;
//   }
//   // commandPathInfo
//   const commandPathInfo = extractCommandPathInfo(fsPath);
//   if (!commandPathInfo.moduleName) {
//     return;
//   }
//   // invoke
//   await invokeZovaCli(
//     [':tools:icon', commandPathInfo.moduleName],
//     commandPathInfo.projectCurrent
//   );
//   window.showInformationMessage('Generate icon successfully!');
// }

export async function toolsMetadata(resource?: Uri) {
  const { fsPath } = preparePathResource(resource);
  if (!fsPath) {
    return;
  }
  // commandPathInfo
  const commandPathInfo = extractCommandPathInfo(fsPath);
  // invoke
  const args = [':tools:metadata'];
  if (commandPathInfo.moduleName) {
    args.push(commandPathInfo.moduleName);
  } else {
    args.push('--force');
  }
  await invokeZovaCli(args, commandPathInfo.projectCurrent);
  // open
  if (commandPathInfo.moduleName) {
    const fileDest = path.join(commandPathInfo.moduleRoot, 'src/.metadata/index.ts');
    showTextDocument(path.join(commandPathInfo.projectCurrent, fileDest));
  } else {
    window.showInformationMessage('Generate .metadata successfully!');
  }
}
