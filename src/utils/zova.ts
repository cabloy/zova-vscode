import path from 'node:path';
import fse from 'fs-extra';
import * as vscode from 'vscode';

export interface IProjectInfo {
  directoryCurrent?: string;
  isMulti?: boolean;
}
let _projectInfo: IProjectInfo = {
  directoryCurrent: undefined,
  isMulti: false,
};

export function getWorkspaceRootDirectory(): string {
  return vscode.workspace.workspaceFolders?.[0].uri.fsPath!;
}

export function isZovaProject(pathRoot: string) {
  if (!pathRoot) {
    return false;
  }
  const pathTest = path.join(pathRoot, 'src/boot/zova.ts');
  return fse.pathExistsSync(pathTest);
}

export function getProjectInfo() {
  return _projectInfo;
}

export function setProjectInfo(projectInfo: IProjectInfo) {
  Object.assign(_projectInfo, projectInfo);
  vscode.commands.executeCommand(
    'setContext',
    'zova.currentZovaProject',
    _projectInfo.directoryCurrent
  );
}

export async function hasZovaProject(): Promise<IProjectInfo | undefined> {
  // reset
  _projectInfo.directoryCurrent = undefined;
  _projectInfo.isMulti = false;
  // workspace
  const workspaceFolder = getWorkspaceRootDirectory();
  if (!workspaceFolder) {
    return;
  }
  if (isZovaProject(workspaceFolder)) {
    _projectInfo.directoryCurrent = workspaceFolder;
    _projectInfo.isMulti = false;
    return _projectInfo;
  }
  // multi
  let pathNames = await fse.readdir(workspaceFolder);
  pathNames = pathNames
    .map((item) => {
      return path.join(workspaceFolder, item);
    })
    .filter((item) => {
      return isZovaProject(item);
    });
  if (pathNames.length > 0) {
    _projectInfo.isMulti = true;
    return _projectInfo;
  }
}

export function getZovaProjectCurrent(file: string) {
  const projectInfo = getProjectInfo();
  if (!projectInfo.isMulti) {
    return projectInfo.directoryCurrent;
  }
  // multi
  const workspaceFolder = getWorkspaceRootDirectory();
  const pos = file.indexOf(path.sep, workspaceFolder.length + 1);
  const projectFolder = file.substring(0, pos);
  return projectFolder;
}
