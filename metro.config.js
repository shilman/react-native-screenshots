const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const withStorybook = require("@storybook/react-native/metro/withStorybook");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withStorybook(defaultConfig, {
  enabled: true,
  configPath: path.resolve(__dirname, "./.ondevice"),
  websockets:
    process.env.NODE_ENV === "development"
      ? {
          port: 7007,
          hostname: "localhost",
        }
      : undefined,
});
