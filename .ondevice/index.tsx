import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { view } from './storybook.requires';
import { SafeAreaView } from 'react-native';

let onDeviceUI = true;
let Storybook = () => <StorybookUIRoot />;
if (process.env.EXPO_PUBLIC_STORYBOOK_SNAPSHOT) {
  Storybook = () => (
    <SafeAreaView style={{ flex: 1 }}>
      <StorybookUIRoot />
    </SafeAreaView>
  );
  onDeviceUI = false;
}

const StorybookUIRoot = view.getStorybookUI({
  enableWebsockets: true,
  onDeviceUI,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default Storybook;
