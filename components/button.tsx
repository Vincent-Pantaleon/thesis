// components/button.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

type IconButtonProps = {
  onPress: () => void;
  backgroundColor: string;
  iconColor: string;
  iconName: IconName;
};

export default function Button({ onPress,  backgroundColor , iconColor, iconName }: IconButtonProps) {
  return (
    <Pressable onPress={onPress} style={[styles.button, { backgroundColor }]}>
      <MaterialIcons name={iconName} size={24} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // optional shadow for Android
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
});
