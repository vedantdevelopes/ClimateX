import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useUser } from '../store/useUser';
import { lightTheme, darkTheme } from '../theme/tokens';

interface HeadingProps extends TextProps {
  size?: 'large' | 'medium' | 'small' | 'subheading';
  color?: string;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  size = 'medium',
  color,
  style,
  children,
  ...props
}) => {
  const themeMode = useUser((s) => s.profile.theme);
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const fontColor = color || theme.text;

  return (
    <Text
      style={[
        styles.base,
        size === 'large' && styles.large,
        size === 'medium' && styles.medium,
        size === 'small' && styles.small,
        size === 'subheading' && styles.subheading,
        { color: fontColor },
        style,
      ]}
      accessibilityRole="header"
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Anton_400Regular',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  large: {
    fontSize: 52,
    lineHeight: 56,
  },
  medium: {
    fontSize: 32,
    lineHeight: 36,
  },
  small: {
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.5,
  },
});
