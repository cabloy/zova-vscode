import { ExtensionContext, window, Disposable } from 'vscode';

export class TextEditorWatchers {
  context: ExtensionContext;
  textEditorDisposable?: Disposable;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  start() {
    this.textEditorDisposable = window.onDidChangeActiveTextEditor((e) => {
      console.log(e);
    });
  }

  stop() {
    if (this.textEditorDisposable) {
      this.textEditorDisposable.dispose();
      this.textEditorDisposable = undefined;
    }
  }
}
