# React Native Screenshots

This demonstrates how to screenshot React Native (RN) from a mobile simulator and test them in Chromatic.

It consists of the following:

1. **RN storybook**. The "main" Storybook, configured by the `.rnstorybook` config dir.
2. **Snapshot script**. A script, `snapshot-storybook.ts`, that navigates to every story in the running RN storybook and dumps a snapshot into the `snapshots` directory.
3. **Snapshot storybook**. A second Storybook, configured by the `.storybook` config dir, that renders images from the `screenshots` directory as stories, so that Chromatic can process them.
4. **Github action**. A Github action workflow that runs on MacOS and executes the snapshot script to populate the `screenshots` directory.

![architecture](https://github.com/user-attachments/assets/504588df-4e56-404c-b550-a76c967df079)

## Running locally

0. You need to run the app once to get it installed on your simulator. This is slow, but you only need to do it once.

```
npm run ios
```

After your app is bootstrapped, screenshotting your RN app requires a few steps:

1. Start the RN version with `EXPO_PUBLIC_STORYBOOK_SNAPSHOT=true`. `EXPO_PUBLIC_STORYBOOK_SNAPSHOT` removes Storybook's UI for cleaner screenshots.

```sh
EXPO_PUBLIC_STORYBOOK_SNAPSHOT=true npm run storybook:ios
```

2. After the RN version is running, run the snapshot tool, which will loop over the stories and save them into the `screenshots` directory.

```sh
npm run snapshot-storybook
```

3. View the screenshot Storybook to see the results as they will be sent to Chromatic.

```sh
npm run storybook:web
```

## Running in CI

Running in CI requires a built application binary:

```sh
build.sh
```

This generates the file `AwesomeStorybook.tar.gz`, which is consumed by the CI script.
In this prototype, we are doing this by hand and checking it into Git for our own convenience

We assume that real-world RN projects are already building binaries as part of their CI workflow
and that you would update the scripts to consume those instead of the hard-coded build shown here.

## Known limitations

The prototype has the following known limitations, none of which are fundamental to the approach:

- [ ] Lack of story-level Chromatic configuration. Chromatic can be configured in various ways, e.g. to skip stories, or even to ignore regions within a story. This prototype would need to be extended to add these features.
