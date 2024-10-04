const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

// defaultConfig.transformer.unstable_allowRequireContext = true;

// defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
//   const defaultResolveResult = context.resolveRequest(context, moduleName, platform);

//   if (
//     process.env.STORYBOOK_ENABLED !== 'true' &&
//     defaultResolveResult?.filePath?.includes?.('.ondevice/')
//   ) {
//     return {
//       type: 'empty',
//     };
//   }

//   return defaultResolveResult;
// };

module.exports = withStorybook(defaultConfig, {
  enabled: true,
  configPath: path.resolve(__dirname, './.ondevice'),
  websockets: {
    port: 7007,
    hostname: 'localhost',
  },
});
