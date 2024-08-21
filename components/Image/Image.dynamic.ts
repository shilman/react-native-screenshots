import file from 'react-native-blob-util';
import { dedent } from 'ts-dedent';
import type { StoryConfigs } from '../dynamic';
import { defineStories } from '../dynamic';

export default defineStories({
  baseCsf: dedent`
    import { Images } from './Image';
    export default { component: Images, parameters: {
    layout: 'fullscreen',
  }, };
  `,
  stories: async () => {
    const result = {} as StoryConfigs;
    const fixtureDir = '../fixtures';
    const fixtures = (await file.fs.readFile(fixtureDir, 'utf8')).filter(
      (file) => file.name.endsWith('.json')
    );
    await Promise.all(
      fixtures.map(async (file) => {
        try {
          const fixture = JSON.parse(
            await file.fs.readFile(`${fixtureDir}/${file}`)
          );
          fixture.states.map((entry: { name: string; filePath: string }) => {
            result[entry.name] = { args: entry };
          });
        } catch (err) {
          console.warn({ file, err });
        }
      })
    );
    return result;
  },
});
