import path from 'node:path';
import fse from 'fs-extra';
import * as vscode from 'vscode';
import eggBornUtils from 'egg-born-utils';

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
  const pathNames = await eggBornUtils.tools.globbyAsync(
    path.join(workspaceFolder, '*/src/boot/zova.ts')
  );
  if (pathNames.length > 0) {
    _projectInfo.isMulti = true;
    return _projectInfo;
  }
}
