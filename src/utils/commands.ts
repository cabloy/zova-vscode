import { commands, ExtensionContext } from 'vscode';
import {
  createGeneralBean,
  createLocalBean,
  createModelBean,
  createStoreBean,
  createStyleBean,
  createThemeBean,
  createToolBean,
} from '../commands/create/bean.js';
import { logger } from './outputChannel.js';
import { LocalConsole } from './console.js';
import { ProcessHelper } from '@cabloy/process-helper';
import { getWorkspaceRootDirectory } from './zova.js';
import { existsSync } from 'fs-extra';
import path from 'node:path';
import { createComponent } from '../commands/create/component.js';
import { createPage } from '../commands/create/page.js';
import { initIcon } from '../commands/init/icon.js';
import { toolsMetadata } from '../commands/tools/metadata.js';
import { initConfig } from '../commands/init/config.js';
import { initConstant } from '../commands/init/constant.js';
import { initLocale } from '../commands/init/locale.js';
import { initError } from '../commands/init/error.js';
import { createService } from '../commands/create/service.js';
import { createMock } from '../commands/create/mock.js';
import { createModule } from '../commands/create/module.js';
import { createSuite } from '../commands/create/suite.js';

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
  { command: 'zova.createPage', function: createPage },
  { command: 'zova.createService', function: createService },
  { command: 'zova.createMock', function: createMock },
  { command: 'zova.createModule', function: createModule },
  { command: 'zova.createSuite', function: createSuite },
  // init
  { command: 'zova.initIcon', function: initIcon },
  { command: 'zova.initConfig', function: initConfig },
  { command: 'zova.initConstant', function: initConstant },
  { command: 'zova.initLocale', function: initLocale },
  { command: 'zova.initError', function: initError },
  // tools
  { command: 'zova.toolsMetadata', function: toolsMetadata },
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
