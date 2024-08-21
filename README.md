![image](https://user-images.githubusercontent.com/3481514/145904252-92e3dc1e-591f-410f-88a1-b4250f4ba6f2.png)

## Taking image snapshots of Storybook

Screenshotting your RN app requires a few steps:

1. Start the web version of Storybook. You should see the string "websocket connection established".

```sh
npm run storybook:web
```

1. After the web version is running, start the RN version with `EXPO_PUBLIC_STORYBOOK_SNAPSHOT=1`. `EXPO_PUBLIC_STORYBOOK_SNAPSHOT` removes Storybook's UI for cleaner screenshots.

```sh
EXPO_PUBLIC_STORYBOOK_SNAPSHOT=1 npm run storybook:ios
```

3. After the RN version is running, run the snapshot tool, which will loop over the stories and save them into the `screenshots` directory.

```sh
npm run snapshot-storybook
```
