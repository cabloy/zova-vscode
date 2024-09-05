import { ProcessHelper } from '@cabloy/process-helper';
import { Uri, window } from 'vscode';
import { getZovaProjectCurrent } from '../utils/zova.js';
import { LocalConsole } from '../utils/console.js';

export async function createLocalBean(resource: Uri) {
  const projectCurrent = getZovaProjectCurrent(resource.fsPath);
  const console = new LocalConsole();
  const processHelper = new ProcessHelper(projectCurrent, console);
  // spawn
  await processHelper.spawnCmd({
    cmd: 'zova',
    args: [':tools:icons', 'home-icon'],
    options: {
      stdio: 'pipe',
    },
  });
  window.showInformationMessage('Hello World from zova-vscode!');
}
