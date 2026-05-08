import { ProcessHelper } from '@cabloy/process-helper';
import { existsSync } from 'fs-extra';
import path from 'node:path';
import { commands, ExtensionContext, window } from 'vscode';

import {
  beanAction,
  beanAop,
  beanAopMethod,
  beanApi,
  beanBehavior,
  beanCss,
  beanData,
  beanGeneral,
  beanInterceptor,
  beanMetaThemeHandler,
  beanModel,
  beanService,
  beanSys,
  beanTableCell,
  beanTheme,
  beanTool,
} from '../commands/create/bean.js';
import {
  createComponent,
  createComponentBlockPage,
  createComponentBlockPageEntry,
  createComponentFormAction,
  createComponentFormField,
  createComponentTableActionBulk,
} from '../commands/create/component.js';
import { createMock } from '../commands/create/mock.js';
import { createModule } from '../commands/create/module.js';
import { createPage } from '../commands/create/page.js';
import { createSuite } from '../commands/create/suite.js';
import { initAppMonkey, initSysMonkey } from '../commands/init/appMonkey.js';
import { initAsset } from '../commands/init/asset.js';
import { initConfig } from '../commands/init/config.js';
import { initConstant } from '../commands/init/constant.js';
import { initError } from '../commands/init/error.js';
import { initIcon } from '../commands/init/icon.js';
import { initLegacy } from '../commands/init/legacy.js';
import { initLib } from '../commands/init/lib.js';
import { initLocale } from '../commands/init/locale.js';
import { initMain, initMainSys } from '../commands/init/main.js';
import { initMonkey, initMonkeySys } from '../commands/init/monkey.js';
import { initTypes } from '../commands/init/types.js';
import { refactorAnotherRender } from '../commands/refactor/anotherRender.js';
import { refactorAnotherStyle } from '../commands/refactor/anotherStyle.js';
import { refactorComponentGeneric } from '../commands/refactor/componentGeneric.js';
import { refactorComponentModel } from '../commands/refactor/componentModel.js';
import { refactorComponentProps } from '../commands/refactor/componentProps.js';
import { refactorFirstRender } from '../commands/refactor/firstRender.js';
import { refactorFirstStyle } from '../commands/refactor/firstStyle.js';
import { refactorPageParams } from '../commands/refactor/pageParams.js';
import { refactorPageQuery } from '../commands/refactor/pageQuery.js';
import { refactorRenameComponent } from '../commands/refactor/renameComponent.js';
import { refactorRenamePage } from '../commands/refactor/renamePage.js';
import { toolsMetadata } from '../commands/tools/metadata.js';
import { toolsOpenapiConfig, toolsOpenapiGenerate } from '../commands/tools/openapi.js';
import { LocalConsole } from './console.js';
import { getWorkspaceRootDirectory } from './zova.js';

const extensionCommands = [
  // create
  { command: 'zova.createComponent', function: createComponent },
  {
    command: 'zova.createComponentFormField',
    function: createComponentFormField,
  },
  {
    command: 'zova.createComponentBlockPage',
    function: createComponentBlockPage,
  },
  {
    command: 'zova.createComponentBlockPageEntry',
    function: createComponentBlockPageEntry,
  },
  {
    command: 'zova.createComponentFormAction',
    function: createComponentFormAction,
  },
  {
    command: 'zova.createComponentTableActionBulk',
    function: createComponentTableActionBulk,
  },
  { command: 'zova.createPage', function: createPage },
  { command: 'zova.createApi', function: beanApi },
  { command: 'zova.createModel', function: beanModel },
  { command: 'zova.createService', function: beanService },
  { command: 'zova.createMock', function: createMock },
  { command: 'zova.createModule', function: createModule },
  { command: 'zova.createSuite', function: createSuite },
  // bean
  { command: 'zova.beanCss', function: beanCss },
  { command: 'zova.beanTheme', function: beanTheme },
  { command: 'zova.beanTool', function: beanTool },
  { command: 'zova.beanGeneral', function: beanGeneral },
  { command: 'zova.beanSys', function: beanSys },
  { command: 'zova.beanAop', function: beanAop },
  { command: 'zova.beanAopMethod', function: beanAopMethod },
  { command: 'zova.beanData', function: beanData },
  { command: 'zova.beanBehavior', function: beanBehavior },
  { command: 'zova.beanInterceptor', function: beanInterceptor },
  { command: 'zova.beanTableCell', function: beanTableCell },
  { command: 'zova.beanAction', function: beanAction },
  { command: 'zova.beanMetaThemeHandler', function: beanMetaThemeHandler },
  // init
  { command: 'zova.initIcon', function: initIcon },
  { command: 'zova.initConfig', function: initConfig },
  { command: 'zova.initConstant', function: initConstant },
  { command: 'zova.initLocale', function: initLocale },
  { command: 'zova.initError', function: initError },
  { command: 'zova.initLegacy', function: initLegacy },
  { command: 'zova.initAppMonkey', function: initAppMonkey },
  { command: 'zova.initSysMonkey', function: initSysMonkey },
  { command: 'zova.initMonkey', function: initMonkey },
  { command: 'zova.initMonkeySys', function: initMonkeySys },
  { command: 'zova.initMain', function: initMain },
  { command: 'zova.initMainSys', function: initMainSys },
  { command: 'zova.initAsset', function: initAsset },
  { command: 'zova.initLib', function: initLib },
  { command: 'zova.initTypes', function: initTypes },
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
      this.context.subscriptions.push(commands.registerCommand(command, wrapperCommand(command, commandFunction)));
    }
  }
}

function wrapperCommand(_command, fn) {
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

export async function invokeToolsMetadata(moduleName: string, projectCurrent: string) {
  // tools.metadata
  await invokeZovaCli([':tools:metadata', moduleName], projectCurrent);
}

export async function invokeZovaCli(args: string[], projectCurrent: string, forceGlobalCli?: boolean) {
  const console = new LocalConsole();
  const processHelper = new ProcessHelper(projectCurrent, console);
  const workspaceFolder = getWorkspaceRootDirectory();
  args = args.concat('--vscode');
  let res;
  if (!forceGlobalCli && existsSync(path.join(workspaceFolder, 'zova-cli'))) {
    res = await processHelper.spawnExe({
      cmd: 'node',
      args: [path.join(workspaceFolder, 'zova-cli/cli/src/bin/zova.ts')].concat(args),
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

export async function invokePnpmCli(args: string[], projectCurrent: string) {
  const console = new LocalConsole();
  const processHelper = new ProcessHelper(projectCurrent, console);
  // spawn
  return await processHelper.spawnCmd({
    cmd: 'pnpm',
    args,
    options: {
      stdio: 'pipe',
      cwd: projectCurrent,
      shell: true,
    },
  });
}
