import { defineMain } from '@storybook/react-native-web-vite/node';

export default defineMain({
  stories: [
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
    '../components/**/*.dynamic.@(js|jsx|ts|tsx)',
  ],
  addons: ['./preset'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {},
  },
  staticDirs: [{ from: '../screenshots', to: 'screenshots' }],
  // reactNativeServerOptions: {
  //   host: 'localhost',
  //   port: 7007,
  // },
});
