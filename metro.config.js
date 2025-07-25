// const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook');
// const exclusionList = require('metro-config/src/defaults/exclusionList');
const defaultConfig = getDefaultConfig(__dirname);

// defaultConfig.resolver.blacklistRE = exclusionList([
//   path.resolve('screenshots/.*'),
// ]);

module.exports = withStorybook(defaultConfig, {
  enabled: true,
  // websockets:
  //   process.env.NODE_ENV === 'development'
  //     ? {
  //         port: 7007,
  //         hostname: 'localhost',
  //       }
  //     : undefined,
});
