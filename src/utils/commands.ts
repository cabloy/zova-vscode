import { commands, ExtensionContext, window } from 'vscode';
import {
  beanGeneral,
  beanAop,
  beanService,
  beanModel,
  beanStore,
  beanCss,
  beanTheme,
  beanTool,
  beanApi,
  beanData,
  beanBehavior,
  beanInterceptor,
  beanMetaThemeHandler,
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
import {
  toolsOpenapiConfig,
  toolsOpenapiGenerate,
} from '../commands/tools/openapi.js';
import { initConfig } from '../commands/init/config.js';
import { initConstant } from '../commands/init/constant.js';
import { initLocale } from '../commands/init/locale.js';
import { initError } from '../commands/init/error.js';
import { initLegacy } from '../commands/init/legacy.js';
import { initMonkey } from '../commands/init/monkey.js';
import { initMain } from '../commands/init/main.js';
import { createMock } from '../commands/create/mock.js';
import { createModule } from '../commands/create/module.js';
import { createSuite } from '../commands/create/suite.js';
import { refactorPageQuery } from '../commands/refactor/pageQuery.js';
import { refactorPageParams } from '../commands/refactor/pageParams.js';
import { refactorComponentGeneric } from '../commands/refactor/componentGeneric.js';
import { refactorFirstRender } from '../commands/refactor/firstRender.js';
import { refactorFirstStyle } from '../commands/refactor/firstStyle.js';
import { refactorAnotherRender } from '../commands/refactor/anotherRender.js';
import { refactorAnotherStyle } from '../commands/refactor/anotherStyle.js';
import { refactorRenamePage } from '../commands/refactor/renamePage.js';
import { refactorComponentProps } from '../commands/refactor/componentProps.js';
import { refactorComponentEmits } from '../commands/refactor/componentEmits.js';
import { refactorComponentSlots } from '../commands/refactor/componentSlots.js';
import { refactorComponentModel } from '../commands/refactor/componentModel.js';
import { refactorRenameComponent } from '../commands/refactor/renameComponent.js';

const extensionCommands = [
  // create
  { command: 'zova.createComponent', function: createComponent },
  { command: 'zova.createPage', function: createPage },
  { command: 'zova.createApi', function: beanApi },
  { command: 'zova.createModel', function: beanModel },
  { command: 'zova.createService', function: beanService },
  { command: 'zova.createMock', function: createMock },
  { command: 'zova.createModule', function: createModule },
  { command: 'zova.createSuite', function: createSuite },
  // bean
  { command: 'zova.beanStore', function: beanStore },
  { command: 'zova.beanCss', function: beanCss },
  { command: 'zova.beanTheme', function: beanTheme },
  { command: 'zova.beanTool', function: beanTool },
  { command: 'zova.beanGeneral', function: beanGeneral },
  { command: 'zova.beanAop', function: beanAop },
  { command: 'zova.beanData', function: beanData },
  { command: 'zova.beanBehavior', function: beanBehavior },
  { command: 'zova.beanInterceptor', function: beanInterceptor },
  { command: 'zova.beanMetaThemeHandler', function: beanMetaThemeHandler },
  // init
  { command: 'zova.initIcon', function: initIcon },
  { command: 'zova.initConfig', function: initConfig },
  { command: 'zova.initConstant', function: initConstant },
  { command: 'zova.initLocale', function: initLocale },
  { command: 'zova.initError', function: initError },
  { command: 'zova.initLegacy', function: initLegacy },
  { command: 'zova.initMonkey', function: initMonkey },
  { command: 'zova.initMain', function: initMain },
  // refactor
  { command: 'zova.refactorPageQuery', function: refactorPageQuery },
  { command: 'zova.refactorPageParams', function: refactorPageParams },
  {
    command: 'zova.refactorComponentGeneric',
    function: refactorComponentGeneric,
  },
  { command: 'zova.refactorFirstRender', function: refactorFirstRender },
  { command: 'zova.refactorFirstStyle', function: refactorFirstStyle },
  { command: 'zova.refactorAnotherRender', function: refactorAnotherRender },
  { command: 'zova.refactorAnotherStyle', function: refactorAnotherStyle },
  { command: 'zova.refactorRenamePage', function: refactorRenamePage },
  { command: 'zova.refactorComponentProps', function: refactorComponentProps },
  { command: 'zova.refactorComponentEmits', function: refactorComponentEmits },
  { command: 'zova.refactorComponentSlots', function: refactorComponentSlots },
  { command: 'zova.refactorComponentModel', function: refactorComponentModel },
  {
    command: 'zova.refactorRenameComponent',
    function: refactorRenameComponent,
  },
  // tools
  { command: 'zova.toolsMetadata', function: toolsMetadata },
  { command: 'zova.toolsOpenapiConfig', function: toolsOpenapiConfig },
  { command: 'zova.toolsOpenapiGenerate', function: toolsOpenapiGenerate },
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
      // need not logger.log to avoid log the same error twice
      // logger.log(`command: ${command} Error: ${err.message}`);
      window.showInformationMessage(err.message);
    }
  };
}

export async function invokeZovaCli(
  args: string[],
  projectCurrent: string,
  forceGlobalCli?: boolean
) {
  const console = new LocalConsole();
  const processHelper = new ProcessHelper(projectCurrent, console);
  const workspaceFolder = getWorkspaceRootDirectory();
  args = args.concat('--vscode');
  let res;
  if (!forceGlobalCli && existsSync(path.join(workspaceFolder, 'zova-cli'))) {
    await processHelper.spawnCmd({
      cmd: 'tsc',
      args: ['-b'],
      options: {
        stdio: 'pipe',
        cwd: path.join(workspaceFolder, 'zova-cli'),
        shell: true,
      },
    });
    res = await processHelper.spawnExe({
      cmd: 'node',
      args: [
        path.join(workspaceFolder, 'zova-cli/cli/dist/bin/zova.js'),
      ].concat(args),
      options: {
        stdio: 'pipe',
        cwd: projectCurrent,
        shell: true,
      },
    });
  } else {
    // spawn
    res = await processHelper.spawnCmd({
      cmd: 'zova',
      args,
      options: {
        stdio: 'pipe',
        cwd: projectCurrent,
        shell: true,
      },
    });
  }
  return res;
}
