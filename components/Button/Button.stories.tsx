import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { View } from "react-native";
import { MyButton } from "./Button";

const meta = {
  title: "MyButton",
  component: MyButton,
  args: {
    text: "Hello world",
    onPress: () => console.log("Button pressed"),
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
export const Complex: Story = {
  args: {
    text: "Complex",
  },
};
