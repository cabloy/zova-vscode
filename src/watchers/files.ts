import { ExtensionContext, FileSystemWatcher, RelativePattern, workspace } from 'vscode';

import { getWorkspaceRootDirectory } from '../utils/zova.js';

export class FileWatchers {
  context: ExtensionContext;
  rootWatcher?: FileSystemWatcher;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  start() {
    this.rootWatcher = workspace.createFileSystemWatcher(new RelativePattern(getWorkspaceRootDirectory(), '**/*'));
    this.rootWatcher.onDidCreate(uri => {
      // eslint-disable-next-line
      console.log('create:', uri);
    });
    this.rootWatcher.onDidChange(uri => {
      // eslint-disable-next-line
      console.log('change:', uri);
    });
    this.rootWatcher.onDidDelete(uri => {
      // eslint-disable-next-line
      console.log('delete:', uri);
    });
  }

  stop() {
    if (this.rootWatcher) {
      this.rootWatcher.dispose();
      this.rootWatcher = undefined;
    }
  }
}
