import path from 'node:path';
import * as vscode from 'vscode';

import { hasZovaProject, IProjectInfo } from './zova.js';

export class ContextKeys {
  async initialize() {
    const projectInfo = await this._setProjectInfo();
    if (!projectInfo) {
      return;
    }
    return projectInfo;
  }

  async _setProjectInfo() {
    const projectInfo = await hasZovaProject();
    // zova.hasZovaProject
    vscode.commands.executeCommand('setContext', 'zova.hasZovaProject', !!projectInfo);
    // more keys
    await this._setMoreKeys(projectInfo);
    // ok
    return projectInfo;
  }

  async _setMoreKeys(projectInfo?: IProjectInfo) {
    if (!projectInfo || !projectInfo.projectPaths) {
      return;
    }
    // zova.arrayProjectRoot
    vscode.commands.executeCommand('setContext', 'zova.arrayProjectRoot', projectInfo.projectPaths);
    // zova.arrayProjectSrc
    vscode.commands.executeCommand(
      'setContext',
      'zova.arrayProjectSrc',
      projectInfo.projectPaths.map(item => path.join(item, 'src')),
    );
  }
}
