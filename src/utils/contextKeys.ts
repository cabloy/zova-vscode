import * as vscode from 'vscode';
import {
  getWorkspaceRootDirectory,
  hasZovaProject,
  IProjectInfo,
} from './zova.js';

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
    vscode.commands.executeCommand(
      'setContext',
      'zova.hasZovaProject',
      !!projectInfo
    );
    // zova.currentZovaProject
    if (projectInfo && !projectInfo.isMulti) {
      vscode.commands.executeCommand(
        'setContext',
        'zova.currentZovaProject',
        projectInfo.directoryCurrent
      );
    }
    // more keys
    await this._setMoreKeys(projectInfo);
    // ok
    return projectInfo;
  }

  async _setMoreKeys(projectInfo?: IProjectInfo) {
    if (!projectInfo) {
      return;
    }
    // arrayProjectRoot
    const workspaceFolder = getWorkspaceRootDirectory();
    const arrayProjectRoot = projectInfo.isMulti
      ? projectInfo.projectNames.map((item) => `${workspaceFolder}/${item}`)
      : [workspaceFolder];
    // zova.arrayProjectRoot
    vscode.commands.executeCommand(
      'setContext',
      'zova.arrayProjectRoot',
      arrayProjectRoot
    );
    // zova.arrayProjectSrc
    vscode.commands.executeCommand(
      'setContext',
      'zova.arrayProjectSrc',
      arrayProjectRoot.map((item) => `${item}/src`)
    );
  }
}
