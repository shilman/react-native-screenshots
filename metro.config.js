const { getDefaultConfig } = require('expo/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const defaultConfig = getDefaultConfig(__dirname);
const path = require('path');

defaultConfig.resolver.blacklistRE = exclusionList([
  new RegExp(`${path.resolve('./screenshots')}.*\\.png`),
]);

module.exports = withStorybook(defaultConfig, {
  enabled: true,
});
