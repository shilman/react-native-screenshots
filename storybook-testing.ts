import 'websocket-polyfill';
import { Channel, WebsocketTransport } from 'storybook/internal/channels';
import Events from 'storybook/internal/core-events';
import { execSync } from 'child_process';
import { buildIndex } from 'storybook/internal/core-server';
import { WebSocketServer } from 'ws';

async function doEverything() {
  const secured = false;
  const host = 'localhost';
  const port = 7007;
  const domain = `${host}:${port}`;

  const wss = new WebSocketServer({ port, host });

  const exec = (command: string) => {
    try {
      execSync(command);
    } catch (error) {
      console.error('Error executing command', command, error);
      process.exit(1);
    }
  };

  wss.on('connection', function connection(ws) {
    console.log('websocket connection established');

    ws.on('error', console.error);

    ws.on('message', function message(data) {
      try {
        const json = JSON.parse(data.toString());

        wss.clients.forEach((wsClient) => wsClient.send(JSON.stringify(json)));
      } catch (error) {
        console.error(error);
      }
    });
  });

  const websocketType = secured ? 'wss' : 'ws';
  let url = `${websocketType}://${domain}`;
  const channel = new Channel({
    transport: new WebsocketTransport({
      url,
      page: 'manager',
      onError: console.error,
    }),
  });

  // kill the app if it's running
  exec('xcrun simctl terminate booted com.chromatic.awesomestorybook || true');

  // launch the app
  exec('xcrun simctl launch booted com.chromatic.awesomestorybook');

  console.log('Starting storybook testing');

  const configPath = './.rnstorybook';

  const index = await buildIndex({ configDir: configPath });
  const entries = Object.values(index.entries).filter(
    (entry) => entry.type === 'story',
  );

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function GoThroughAllStories() {
    // wait 500ms for storybook to start?
    await sleep(500);

    for (const entry of entries) {
      console.log('story', entry.title, entry.name);

      channel.emit(Events.SET_CURRENT_STORY, { storyId: entry.id });
      await new Promise((resolve) => {
        channel.on(Events.CURRENT_STORY_WAS_SET, resolve);
      });
      exec(
        `xcrun simctl io booted screenshot --type png screenshots/${entry.id}.png`,
      );
    }
  }

  channel.once(Events.STORY_RENDERED, () => {
    console.log('Going through all stories');
    GoThroughAllStories()
      .then(() => {
        exec(
          'xcrun simctl terminate booted com.chromatic.awesomestorybook || true',
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
}

doEverything();
