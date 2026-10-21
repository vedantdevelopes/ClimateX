import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';
import { useUser } from '../store/useUser';
import { lightTheme, darkTheme } from '../theme/tokens';

interface OutlineNumberProps {
  value: string | number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const OutlineNumber: React.FC<OutlineNumberProps> = ({
  value,
  size = 56,
  strokeWidth = 1.5,
  color,
}) => {
  const themeMode = useUser((s) => s.profile.theme);
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const strokeColor = color || theme.text;
  const str = String(value);
  // Estimate SVG width based on character count and font size
  const svgWidth = Math.max(size * 0.7 * str.length, size);
  const svgHeight = size * 1.15;

  return (
    <View style={styles.container}>
      <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <SvgText
          x="50%"
          y="75%"
          textAnchor="middle"
          fontSize={size}
          fontFamily="Anton_400Regular"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          letterSpacing="-1"
        >
          {str}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
