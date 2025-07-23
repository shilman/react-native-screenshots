rm -rf build-*.tar.gz AwesomeStorybook.app
eas build --profile screenshot --platform ios --local
mv build-*.tar.gz AwesomeStorybook.tar.gz 