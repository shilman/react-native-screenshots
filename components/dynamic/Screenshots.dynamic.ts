import { readdir } from 'fs/promises';
import { extname } from 'path';
import { dedent } from 'ts-dedent';
import { type StoryConfigs, defineStories } from './dynamic';

export default defineStories({
  baseCsf: dedent`
    import { Image } from './Image';
    export default {
      title: 'Screenshots',
      component: Image,
      parameters: {
        layout: 'fullscreen',
      },
    };
  `,
  stories: async () => {
    const result = {} as StoryConfigs;
    const snaphshotDir = `./screenshots`;
    const files = await readdir(snaphshotDir);
    files
      .filter((f) => extname(f) === '.png')
      .forEach((file) => {
        const name = file.replace('.png', '');
        const exportKey = name.replaceAll('-', ''); // FIXME not robust
        result[exportKey] = { name, args: { src: `/screenshots/${file}` } };
      });
    return result;
  },
});
