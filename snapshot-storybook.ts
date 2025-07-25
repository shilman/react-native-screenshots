import 'websocket-polyfill';
import { Channel, WebsocketTransport } from 'storybook/internal/channels';
import Events from 'storybook/internal/core-events';
import { execSync } from 'child_process';
import { buildIndex } from 'storybook/internal/core-server';
import { WebSocketServer } from 'ws';

const exec = (
  command: string,
  {
    errorMessage,
    exitOnError = true,
  }: { errorMessage?: string; exitOnError?: boolean } = { exitOnError: true },
) => {
  try {
    execSync(command);
  } catch (error) {
    if (errorMessage) {
      console.error(errorMessage);
    } else {
      console.error('Error executing command', command, error);
    }

    if (exitOnError) {
      process.exit(1);
    }
  }
};

interface SimulatorDevice {
  udid: string;
  name: string;
  state: 'Shutdown' | 'Booted' | 'Shutting Down' | 'Booting';
  isAvailable: boolean;
  deviceTypeIdentifier: string;
}

interface SimulatorData {
  devices: Record<string, SimulatorDevice[]>;
}

const bootBestSimulator = (): string => {
  const { devices }: SimulatorData = JSON.parse(
    execSync('xcrun simctl list devices --json', { encoding: 'utf8' }),
  );

  const availableDevices = Object.values(devices)
    .flat()
    .filter((d) => d.name.includes('iPhone') && d.isAvailable)
    .sort((a, b) => {
      // Prefer booted devices
      const bootedDiff =
        (b.state === 'Booted' ? 1 : 0) - (a.state === 'Booted' ? 1 : 0);
      if (bootedDiff !== 0) return bootedDiff;

      // Prefer devices that match "iPhone [number]" pattern
      const aIsStandard = /^iPhone \d+$/.test(a.name);
      const bIsStandard = /^iPhone \d+$/.test(b.name);

      if (!aIsStandard && bIsStandard) return 1;
      if (aIsStandard && !bIsStandard) return -1;

      // Fall back to name comparison
      return b.name.localeCompare(a.name);
    });

  const device = availableDevices[0];
  if (!device) throw new Error('No iPhone simulator found');

  if (device.state === 'Booted') {
    return device.udid;
  }

  execSync(`xcrun simctl boot ${device.udid}`, { stdio: 'inherit' });
  return device.udid;
};

async function snapshotStorybook() {
  const secured = false;
  const host = 'localhost';
  const port = 7007;
  const domain = `${host}:${port}`;

  const wss = new WebSocketServer({ port, host });

  wss.on('connection', function connection(ws) {
    console.log('websocket connection established');

    ws.on('error', (error) => {
      console.error('websocket error', error);
    });

    ws.on('message', function message(data) {
      try {
        const json = JSON.parse(data.toString());

        wss.clients.forEach((wsClient) => wsClient.send(JSON.stringify(json)));
      } catch (error) {
        console.log('error parsing message', data.toString());
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
      onError: (error) => console.error('channel error', error),
    }),
  });

  // make sure simulator is booted
  bootBestSimulator();

  exec('xcrun simctl bootstatus booted');

  // will throw if app is not installed
  exec('xcrun simctl get_app_container booted com.chromatic.awesomestorybook', {
    errorMessage:
      'App com.chromatic.awesomestorybook is not installed on device.',
  });

  // kill the app if it's running
  exec('xcrun simctl terminate booted com.chromatic.awesomestorybook || true', {
    exitOnError: false,
  });

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

  async function snapshotAllStories() {
    for (const entry of entries) {
      console.log('story', entry.title, entry.name);

      channel.emit(Events.SET_CURRENT_STORY, { storyId: entry.id });
      await new Promise((resolve, reject) => {
        channel.on(Events.CURRENT_STORY_WAS_SET, resolve);
        setTimeout(() => {
          console.log('story not set', entry.title, entry.name);
          reject(new Error('story not set'));
        }, 5000);
      });
      exec(
        `xcrun simctl io booted screenshot --type png screenshots/${entry.id}.png`,
      );
    }
  }

  // wait 2000ms for storybook to start or for story to be rendered
  await Promise.race([
    sleep(2000),
    new Promise((resolve) => {
      channel.once(Events.STORY_RENDERED, () => {
        setTimeout(() => {
          // extra moment for the dev client nonsense to settle
          resolve(0);
        }, 250);
      });
    }),
  ]);

  console.log('Going through all stories');
  await snapshotAllStories();

  exec('xcrun simctl terminate booted com.chromatic.awesomestorybook || true', {
    exitOnError: false,
  });

  wss.clients.forEach((ws) => ws.close());

  wss.close();

  process.exit(0);
}

snapshotStorybook().catch((e) => {
  console.error(e);
  process.exit(1);
});
