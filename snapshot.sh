#! /bin/bash

# launch the simulator
xcrun simctl boot "iPhone 15"
# check if the simulator is booted
xcrun simctl bootstatus booted
# extract the app
tar -xvzf AwesomeStorybook.tar.gz
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