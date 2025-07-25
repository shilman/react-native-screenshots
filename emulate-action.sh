xcrun simctl boot "iPhone 15"
rm -rf AwesomeStorybook.app Payload AwesomeStorybook.ipa
tar -xvzf AwesomeStorybook.tar.gz
bun run repack:ios
xcrun simctl bootstatus booted
xcrun simctl terminate booted com.chromatic.awesomestorybook || true
xcrun simctl uninstall booted com.chromatic.awesomestorybook || true
# xcrun simctl install booted AwesomeStorybook.app
xcrun simctl launch booted com.chromatic.awesomestorybook
unzip AwesomeStorybook.ipa
xcrun simctl install booted Payload/AwesomeStorybook.app
lsof -ti :7007 | xargs kill

bun run snapshot-storybook
xcrun simctl terminate booted com.chromatic.awesomestorybook || true
xcrun simctl uninstall booted com.chromatic.awesomestorybook || true