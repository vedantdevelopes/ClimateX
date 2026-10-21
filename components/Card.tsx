import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { useUser } from '../store/useUser';
import { lightTheme, darkTheme } from '../theme/tokens';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'surface' | 'inverted' | 'flat';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  style,
  ...props
}) => {
  const themeMode = useUser((s) => s.profile.theme);
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  let bg = theme.cardBg;
  let border = theme.cardBorder;

  if (variant === 'inverted') {
    bg = isDark ? lightTheme.cardBg : darkTheme.cardBg;
    border = isDark ? lightTheme.cardBorder : darkTheme.cardBorder;
  } else if (variant === 'flat') {
    bg = 'transparent';
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: bg,
          borderColor: border,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 4, // nearly square, per design spec
    padding: 16,
    marginVertical: 6,
    // explicitly no elevation or drop shadows
    elevation: 0,
    shadowOpacity: 0,
  },
});
