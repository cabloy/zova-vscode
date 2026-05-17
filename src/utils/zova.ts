import fse from 'fs-extra';
import { globby } from 'globby';
import path from 'node:path';
import * as vscode from 'vscode';

export interface ICommandPathInfo {
  projectCurrent: string;
  suiteRoot?: string;
  suiteName?: string;
  moduleRoot?: string;
  moduleName?: string;
  pathResource: string;
}

export interface IProjectInfo {
  projectPaths?: string[];
}

const _projectInfo: IProjectInfo = {
  projectPaths: undefined,
};

export function getWorkspaceRootDirectory(): string {
  return vscode.workspace.workspaceFolders?.[0].uri.fsPath!;
}

export function isZovaProject(pathRoot: string) {
  if (!pathRoot) {
    return false;
  }
  const pathTest = path.join(pathRoot, '__ZOVA__');
  return fse.pathExistsSync(pathTest);
}

export function getProjectInfo() {
  return _projectInfo;
}

export async function hasZovaProject(): Promise<IProjectInfo | undefined> {
  // workspace
  const workspaceFolder = getWorkspaceRootDirectory();
  if (!workspaceFolder) {
    return;
  }
  const files = await globby('**/__ZOVA__', { cwd: workspaceFolder, deep: 3, ignore: ['**/node_modules/**'] });
  if (files.length === 0) return;
  _projectInfo.projectPaths = files.map(item => {
    return path.join(workspaceFolder, path.dirname(item));
  });
  return _projectInfo;
}

export function getZovaProjectCurrent(resource: string) {
  while (true) {
    if (!resource) return;
    resource = path.dirname(resource);
    if (!resource) return;
    if (isZovaProject(resource)) return resource;
  }
}

export function preparePathResource(resource?: vscode.Uri) {
  const fsPath = resource ? resource.fsPath : vscode.window.activeTextEditor?.document.uri.fsPath;
  if (!fsPath) {
    return { fromPalette: true, fsPath };
  }
  return { fromPalette: !resource, fsPath };
}

export function extractCommandPathInfo(resource: string) {
  const commandPathInfo = {} as ICommandPathInfo;
  commandPathInfo.projectCurrent = getZovaProjectCurrent(resource);
  commandPathInfo.pathResource = resource.substring(commandPathInfo.projectCurrent.length + 1).replaceAll('\\', '/');
  const pathResource = commandPathInfo.pathResource;
  // suite
  const suiteInfo = extractSuiteInfo(pathResource);
  if (suiteInfo) {
    commandPathInfo.suiteRoot = suiteInfo.suiteRoot;
    commandPathInfo.suiteName = suiteInfo.suiteName;
    commandPathInfo.pathResource = suiteInfo.resource;
  }
  // module
  const moduleInfo = extractModuleInfo(pathResource);
  if (moduleInfo) {
    commandPathInfo.moduleRoot = moduleInfo.moduleRoot;
    commandPathInfo.moduleName = moduleInfo.moduleName;
    commandPathInfo.pathResource = moduleInfo.resource;
  }
  return commandPathInfo;
}

export function extractSuiteInfo(resource: string) {
  const patterns = [/src\/suite\/([^/]+)/, /src\/suite-vendor\/([^/]+)/];
  for (const pattern of patterns) {
    const matches = resource.match(pattern);
    if (matches) {
      return {
        suiteRoot: matches[0],
        suiteName: matches[1],
        resource: resource.substring(matches[0].length + 1),
      };
    }
  }
}

export function extractModuleInfo(resource: string) {
  const patterns = [
    /src\/module\/([^/]+)/,
    /src\/module-vendor\/([^/]+)/,
    /src\/suite\/[^/]+\/modules\/([^/]+)/,
    /src\/suite-vendor\/[^/]+\/modules\/([^/]+)/,
  ];
  for (const pattern of patterns) {
    const matches = resource.match(pattern);
    if (matches) {
      return {
        moduleRoot: matches[0],
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

export function trimPathPrefixs(pathResource: string, prefixs: string[]) {
  for (const prefix of prefixs) {
    if (pathResource.startsWith(prefix)) {
      pathResource = pathResource.substring(prefix.length);
    }
  }
  return pathResource;
}
