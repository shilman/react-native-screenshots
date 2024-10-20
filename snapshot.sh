#! /bin/bash

# use this script to test locally all the steps to run the snapshot ci

# remove any previous build
rm -rf build-*.tar.gz AwesomeStorybook.app
# build the app
eas build --profile screenshot --platform ios --local
# unzip the app
tar -xvzf build-*.tar.gz
# launch the simulator
xcrun simctl boot "iPhone 15"
# check if the simulator is booted
xcrun simctl bootstatus booted
# check if the simulator is booted
xcrun simctl bootstatus booted
# terminate the app if it is running
xcrun simctl terminate booted com.chromatic.awesomestorybook || true
# uninstall the app if it is installed
xcrun simctl uninstall booted com.chromatic.awesomestorybook || true
# install the app
xcrun simctl install booted AwesomeStorybook.app
# run the snapshot script
npm run snapshot-storybook