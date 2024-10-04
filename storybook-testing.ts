import 'websocket-polyfill';
import { execSync } from 'child_process';
import { createChannel } from '@storybook/channel-websocket';
import { addons } from '@storybook/addons';
import Events from '@storybook/core-events';
import { toId } from '@storybook/csf';
// @ts-ignore
import { getMain } from '@storybook/react-native/scripts/loader.js';
import { normalizeStories } from '@storybook/core-common';
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';
// import looksSame from 'looks-same';
import { loadCsf } from '@storybook/csf-tools';

const secured = false;
const host = 'localhost';
const port = 7007;
const domain = `${host}:${port}`;
const absolute = true;

const websocketType = secured ? 'wss' : 'ws';
let url = `${websocketType}://${domain}`;
const channel = createChannel({ url });

//@ts-ignore
addons.setChannel(channel);

channel.emit(Events.CHANNEL_CREATED, {
  host,
  port,
  secured,
});

const configPath = './.ondevice';

const mainImport = getMain({ configPath });
const main = mainImport.default ?? mainImport;
const storiesSpecifiers = normalizeStories(main.stories, {
  configDir: configPath,
  workingDir: process.cwd(),
});

function ensureRelativePathHasDot(relativePath: string) {
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

const storyPaths = storiesSpecifiers.reduce((acc, specifier) => {
  const paths = glob
    .sync(specifier.files, {
      cwd: path.resolve(process.cwd(), specifier.directory),
      absolute,
      // default to always ignore (exclude) anything in node_modules
      ignore: ['**/node_modules'],
    })
    .map((storyPath) => {
      const pathWithDirectory = path.join(specifier.directory, storyPath);
      const requirePath = absolute
        ? storyPath
        : ensureRelativePathHasDot(path.relative(configPath, pathWithDirectory));

      const normalizePathForWindows = (str: string) =>
        path.sep === '\\' ? str.replace(/\\/g, '/') : str;

      return normalizePathForWindows(requirePath);
    });
  return [...acc, ...paths];
}, [] as string[]);

async function takeScreenshot(name: string) {
  const out = execSync(`xcrun simctl io booted screenshot --type png assets/${name}.png`);
  console.log(out.toString());
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function GoThroughAllStories() {
  // wait 500ms for storybook to start?
  await sleep(500);

  const csfStories = storyPaths.map((storyPath) => {
    const code = fs.readFileSync(storyPath, { encoding: 'utf-8' }).toString();
    return loadCsf(code, {
      fileName: storyPath,
      makeTitle: (userTitle) => userTitle,
    }).parse();
  });

  for (const { meta, stories } of csfStories) {
    if (meta.title) {
      for (const { name: storyName } of stories) {
        console.log('story', meta.title, storyName);

        const storyId = toId(meta.title, storyName);

        channel.emit(Events.SET_CURRENT_STORY, { storyId });
        await new Promise((resolve) => {
          channel.on(Events.CURRENT_STORY_WAS_SET, resolve);
        });

        await takeScreenshot(storyId);
      }
    }
  }
}

GoThroughAllStories()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
