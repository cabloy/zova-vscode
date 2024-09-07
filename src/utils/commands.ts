import { commands, ExtensionContext } from 'vscode';
import {
  createGeneralBean,
  createLocalBean,
  createModelBean,
  createStoreBean,
  createStyleBean,
  createThemeBean,
  createToolBean,
} from '../commands/bean.js';
import { logger } from './outputChannel.js';
import { LocalConsole } from './console.js';
import { ProcessHelper } from '@cabloy/process-helper';
import { getWorkspaceRootDirectory } from './zova.js';
import { existsSync } from 'fs-extra';
import path from 'node:path';
import { toolsIcons, toolsRes } from '../commands/tools.js';
import { createComponent } from '../commands/component.js';

const extensionCommands = [
  // create
  { command: 'zova.createLocalBean', function: createLocalBean },
  { command: 'zova.createModelBean', function: createModelBean },
  { command: 'zova.createStoreBean', function: createStoreBean },
  { command: 'zova.createStyleBean', function: createStyleBean },
  { command: 'zova.createThemeBean', function: createThemeBean },
  { command: 'zova.createToolBean', function: createToolBean },
  { command: 'zova.createGeneralBean', function: createGeneralBean },
  { command: 'zova.createComponent', function: createComponent },
  // tools
  { command: 'zova.toolsIcons', function: toolsIcons },
  { command: 'zova.toolsRes', function: toolsRes },
];

export class Commands {
  context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  initialize() {
    for (const { command, function: commandFunction } of extensionCommands) {
      this.context.subscriptions.push(
        commands.registerCommand(
          command,
          wrapperCommand(command, commandFunction)
        )
      );
    }
  }
}

function wrapperCommand(command, fn) {
  return async function (...args) {
    try {
      await fn(...args);
    } catch (err) {
      logger.log(`command: ${command} Error: ${err.message}`);
    }
  };
}

export async function invokeZovaCli(args: string[], projectCurrent: string) {
  const console = new LocalConsole();
  const processHelper = new ProcessHelper(projectCurrent, console);
  const workspaceFolder = getWorkspaceRootDirectory();
  if (existsSync(path.join(workspaceFolder, 'zova-cli'))) {
    await processHelper.spawnCmd({
      cmd: 'tsc',
      args: ['-b'],
      options: {
        stdio: 'pipe',
        cwd: path.join(workspaceFolder, 'zova-cli'),
      },
    });
    await processHelper.spawnExe({
      cmd: 'node',
      args: [
        path.join(workspaceFolder, 'zova-cli/cli/dist/bin/zova.js'),
      ].concat(args),
      options: {
        stdio: 'pipe',
        cwd: projectCurrent,
      },
    });
  } else {
    // spawn
    await processHelper.spawnCmd({
      cmd: 'zova',
      args,
      options: {
        stdio: 'pipe',
        cwd: projectCurrent,
      },
    });
  }
}
