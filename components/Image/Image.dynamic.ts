import fs from 'fs/promises';
import { join } from 'path';
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
    const fixtureDir = join(__dirname, './fixtures');
    const fixtures = (await fs.readdir(fixtureDir)).filter((file) =>
      file.endsWith('.json')
    );
    await Promise.all(
      fixtures.map(async (file) => {
        try {
          const fixture = JSON.parse(
            await fs.readFile(join(fixtureDir, file), 'utf-8')
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
