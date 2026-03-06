import Debug from 'debug';
const debug = Debug('codeceptjs:open-in-editor');
import { execSync } from 'child_process';
import { getSettings } from './settings-repository.js';

const openVSCode = fileName => {
  const { editor } = getSettings();
  return execSync(`${editor} "${fileName}"`, (err) => {
    if (!err) return 'Ok';
        console.error('Failed to open editor: ', err.toString()); // eslint-disable-line
        console.error(`Please, update your settings. Current editor command: ${editor}`); // eslint-disable-line
    debug(`Failed to open Editor - ${err}`);
    return `${err}`;
  });
};

export default fileName => {
  // TODO Make this configurable
  openVSCode(fileName);
};
