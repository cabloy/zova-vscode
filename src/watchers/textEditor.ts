import { Disposable, ExtensionContext, window } from 'vscode';
import {
  getProjectInfo,
  getZovaProjectCurrent,
  isZovaProject,
  setProjectInfo,
} from '../utils/zova.js';

export class TextEditorWatchers {
  context: ExtensionContext;
  textEditorDisposable?: Disposable;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  start() {
    this.textEditorDisposable = window.onDidChangeActiveTextEditor(e => {
      this._checkProjectCurrent(e.document.uri.fsPath);
    });
    // check immediately
    this._checkProjectCurrent(window.activeTextEditor?.document.uri.fsPath);
  }

  stop() {
    if (this.textEditorDisposable) {
      this.textEditorDisposable.dispose();
      this.textEditorDisposable = undefined;
    }
  }

  _checkProjectCurrent(file: string) {
    const projectInfo = getProjectInfo();
    if (!projectInfo.isMulti) {
      // do nothing
      return;
    }
    // multi
    const projectFolder = getZovaProjectCurrent(file);
    if (isZovaProject(projectFolder)) {
      setProjectInfo({ directoryCurrent: projectFolder });
    } else {
      setProjectInfo({ directoryCurrent: undefined });
    }
  }
}
