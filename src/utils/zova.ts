import path from 'node:path';
import fse from 'fs-extra';
import { getProjectRootDirectory } from './global.js';

export function isZovaProject() {
  const pathRoot = getProjectRootDirectory();
  if (!pathRoot) {
    return false;
  }
  const pathTest = path.join(getProjectRootDirectory(), 'src/boot/zova.ts');
  return fse.pathExistsSync(pathTest);
}
