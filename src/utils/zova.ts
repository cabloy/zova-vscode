import path from 'node:path';
import fse from 'fs-extra';
import * as vscode from 'vscode';

export interface ICommandPathInfo {
  projectCurrent: string;
  suiteName?: string;
  moduleName?: string;
  pathResource: string;
}

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

export function getZovaProjectCurrent(resource: string) {
  const projectInfo = getProjectInfo();
  if (!projectInfo.isMulti) {
    return projectInfo.directoryCurrent;
  }
  // multi
  const workspaceFolder = getWorkspaceRootDirectory();
  const pos = resource.indexOf(path.sep, workspaceFolder.length + 1);
  const projectFolder = resource.substring(0, pos);
  return projectFolder;
}

export function extractCommandPathInfo(resource: string) {
  let commandPathInfo = {} as ICommandPathInfo;
  commandPathInfo.projectCurrent = getZovaProjectCurrent(resource);
  commandPathInfo.pathResource = resource
    .substring(commandPathInfo.projectCurrent.length + 1)
    .replaceAll('\\', '/');
  const pathResource = commandPathInfo.pathResource;
  // suite
  const suiteInfo = extractSuiteInfo(pathResource);
  if (suiteInfo) {
    commandPathInfo.suiteName = suiteInfo.suiteName;
    commandPathInfo.pathResource = suiteInfo.resource;
  }
  // module
  const moduleInfo = extractModuleInfo(pathResource);
  if (moduleInfo) {
    commandPathInfo.moduleName = moduleInfo.moduleName;
    commandPathInfo.pathResource = moduleInfo.resource;
  }
  return commandPathInfo;
}

export function extractSuiteInfo(resource: string) {
  const patterns = [/src\/suite\/([^\/]+)/, /src\/suite-vendor\/([^\/]+)/];
  for (const pattern of patterns) {
    const matches = resource.match(pattern);
    if (matches) {
      return {
        suiteName: matches[1],
        resource: resource.substring(matches[0].length + 1),
      };
    }
  }
}

export function extractModuleInfo(resource: string) {
  const patterns = [
    /src\/module\/([^\/]+)/,
    /src\/module-vendor\/([^\/]+)/,
    /src\/suite\/[^\/]+\/modules\/([^\/]+)/,
    /src\/suite-vendor\/[^\/]+\/modules\/([^\/]+)/,
  ];
  for (const pattern of patterns) {
    const matches = resource.match(pattern);
    if (matches) {
      return {
        moduleName: matches[1],
        resource: resource.substring(matches[0].length + 1),
      };
    }
  }
}

export function combineCliResourcePath(pathResource: string, resource: string) {
  if (!pathResource) {
    return resource;
  }
  return `${pathResource}/${resource}`;
}
