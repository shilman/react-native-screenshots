import { StyleProp, Text, TextStyle, View } from 'react-native';

interface BadgeProps {
  text: string;
  style?: StyleProp<TextStyle>;
}

export const Badge = ({ text, style }: BadgeProps) => {
  return (
    <View
      style={{
        paddingVertical: 3,
        paddingHorizontal: 8,
        backgroundColor: 'lightgrey',
      }}
    >
      <Text style={[{ textTransform: 'capitalize', color: 'black' }, style]}>
        {text}
      </Text>
    </View>
  );
};
