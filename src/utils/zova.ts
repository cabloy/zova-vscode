import path from 'node:path';
import fse from 'fs-extra';
import * as vscode from 'vscode';

export interface IProjectInfo {
  directoryCurrent?: string;
  isMulti: boolean;
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

export async function hasZovaProject(): Promise<IProjectInfo | undefined> {
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
