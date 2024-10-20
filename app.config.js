export default ({ config }) => ({
  ...config,
  name: 'AwesomeStorybook',
  slug: 'awesome-storybook',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  extra: {
    eas: {
      projectId: '9cfdca5e-bcf6-49c0-80eb-f91bfaf533c6',
    },
  },
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.chromatic.awesomestorybook',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'com.chromatic.awesomestorybook',
  },
  web: {
    favicon: './assets/favicon.png',
  },
});
