// import { Channel, WebsocketTransport } from "@storybook/core/channels";
import "websocket-polyfill";
import { Channel, WebsocketTransport } from "@storybook/core/channels";
import Events from "@storybook/core/core-events";
import { toId } from "@storybook/csf";
import { execSync } from "child_process";
import { normalizeStories } from "@storybook/core/common";
import { loadCsf } from "@storybook/core/csf-tools";
// @ts-ignore
import { getMain } from "@storybook/react-native/scripts/loader.js";
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import { WebSocketServer } from "ws";

const secured = false;
const host = "localhost";
const port = 7007;
const domain = `${host}:${port}`;

const wss = new WebSocketServer({ port, host });

wss.on("connection", function connection(ws) {
  console.log("websocket connection established");

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    try {
      const json = JSON.parse(data.toString());

      wss.clients.forEach((wsClient) => wsClient.send(JSON.stringify(json)));
    } catch (error) {
      console.error(error);
    }
  });
});

const websocketType = secured ? "wss" : "ws";
let url = `${websocketType}://${domain}`;
const channel = new Channel({
  transport: new WebsocketTransport({
    url,
    page: "manager",
    onError: console.error,
  }),
});

// kill the app if it's running
execSync(
  "xcrun simctl terminate booted com.chromatic.awesomestorybook || true"
);

// launch the app
execSync("xcrun simctl launch booted com.chromatic.awesomestorybook");

// create the screenshots directory if it doesn't exist
// execSync("mkdir -p screenshots");

console.log("Starting storybook testing");

const absolute = true;

const configPath = "./.ondevice";

const mainImport = getMain({ configPath });
const main = mainImport.default ?? mainImport;
const storiesSpecifiers = normalizeStories(main.stories, {
  configDir: configPath,
  workingDir: process.cwd(),
});

function ensureRelativePathHasDot(relativePath: string) {
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

const storyPaths = storiesSpecifiers.reduce((acc, specifier) => {
  const paths = glob
    .sync(specifier.files, {
      cwd: path.resolve(process.cwd(), specifier.directory),
      absolute,
      // default to always ignore (exclude) anything in node_modules
      ignore: ["**/node_modules"],
    })
    .map((storyPath) => {
      const pathWithDirectory = path.join(specifier.directory, storyPath);
      const requirePath = absolute
        ? storyPath
        : ensureRelativePathHasDot(
            path.relative(configPath, pathWithDirectory)
          );

      const normalizePathForWindows = (str: string) =>
        path.sep === "\\" ? str.replace(/\\/g, "/") : str;

      return normalizePathForWindows(requirePath);
    });
  return [...acc, ...paths];
}, [] as string[]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function GoThroughAllStories() {
  // wait 500ms for storybook to start?
  await sleep(500);

  const csfStories = storyPaths.map((storyPath) => {
    const code = fs.readFileSync(storyPath, { encoding: "utf-8" }).toString();
    return loadCsf(code, {
      fileName: storyPath,
      makeTitle: (userTitle) => userTitle,
    }).parse();
  });

  for (const { meta, stories } of csfStories) {
    if (meta.title) {
      for (const { name: storyName } of stories) {
        console.log("story", meta.title, storyName);

        const storyId = toId(meta.title, storyName);

        channel.emit(Events.SET_CURRENT_STORY, { storyId });

        await new Promise((resolve) => {
          channel.on(Events.CURRENT_STORY_WAS_SET, resolve);
        });

        execSync(
          `xcrun simctl io booted screenshot --type png screenshots/${storyId}.png`
        );
      }
    }
  }
}

channel.once(Events.STORY_RENDERED, () => {
  console.log("Going through all stories");
  GoThroughAllStories()
    .then(() => {
      execSync(
        "xcrun simctl terminate booted com.chromatic.awesomestorybook || true"
      );

      wss.clients.forEach((ws) => ws.close());

      wss.close();

      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
});
