import * as vscode from 'vscode';
import { hasZovaProject } from './zova.js';

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
    vscode.commands.executeCommand(
      'setContext',
      'zova.hasZovaProject',
      !!projectInfo
    );
    if (projectInfo && !projectInfo.isMulti) {
      vscode.commands.executeCommand(
        'setContext',
        'zova.currentZovaProject',
        projectInfo.directoryCurrent
      );
    }
    return projectInfo;
  }
}
