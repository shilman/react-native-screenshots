import { StyleProp, Text, TextStyle, View } from 'react-native';

interface BadgeProps {
  text: string;
  style?: StyleProp<TextStyle>;
}

export const Badge = ({ text, style }: BadgeProps) => {
  return (
    <View className="py-[3px] px-2 rounded bg-badge">
      <Text className="capitalize text-badge" style={style}>
        {text}
      </Text>
    </View>
  );
};
