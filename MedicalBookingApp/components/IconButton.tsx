import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface IconButtonProps {
  icon: string;
  text: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

type IconMap = {
  [key: string]: string;
};

// Simple icon component using Unicode symbols
export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#333', style = {} }) => {
  const getIconSymbol = (iconName: string): string => {
    const icons: IconMap = {
      'notifications': '🔔',
      'calendar': '📅',
      'videocam': '🎥',
      'medical': '🏥',
      'document-text': '📄',
      'heart': '❤️',
      'pulse': '💓',
      'fitness': '⚖️',
      'water': '💧',
      'trending-up': '📈',
      'trending-down': '📉',
      'remove': '➖',
      'star': '⭐',
      'calendar-outline': '📅',
      'chevron-forward': '➡️',
      'close-circle': '❌',
      'bulb': '💡',
      'person': '👤',
      'settings': '⚙️',
      'logout': '🚪',
      'edit': '✏️',
      'save': '💾',
      'add': '➕',
      'search': '🔍',
      'time': '⌚',
      'location': '📍',
      'phone': '📞',
      'mail': '✉️',
      'info': 'ℹ️',
      'warning': '⚠️',
      'success': '✅',
      'error': '❌',
      'back': '⬅️',
      'next': '➡️',
      'camera': '📷',
      'gallery': '🖼️',
      'lock': '🔒',
      'unlock': '🔓',
      'check': '✓',
      'health': '🩺',
      'home': '🏠',
    };
    return icons[iconName] || '●';
  };

  return (
    <Text style={[{ fontSize: size, color: color }, style]}>
      {getIconSymbol(name)}
    </Text>
  );
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  text,
  onPress,
  color = '#007AFF',
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: color }, style]}
      onPress={onPress}
    >
      <Icon name={icon} size={24} color={color} />
      <Text style={[styles.text, { color }, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
    width: 80,
    height: 80,
  },
  text: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default IconButton; 