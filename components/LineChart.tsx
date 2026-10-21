import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { useUser } from '../store/useUser';
import { lightTheme, darkTheme, colors } from '../theme/tokens';

export interface LinePoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LinePoint[];
  height?: number;
  unit?: string;
  lineColor?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 110,
  unit = '',
  lineColor,
}) => {
  const themeMode = useUser((s) => s.profile.theme);
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const strokeColor = lineColor || colors.teal;

  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          Log calculations to view trend line
        </Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values, minVal + 1);
  const range = maxVal - minVal || 1;

  const width = 300;
  const paddingX = 24;
  const paddingY = 16;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // Build points string
  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(1, data.length - 1)) * graphWidth;
    const y = paddingY + graphHeight - ((d.value - minVal) / range) * graphHeight;
    return { x, y, value: d.value, label: d.label };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={styles.container}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Baseline */}
        <Line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke={isDark ? 'rgba(255,221,221,0.2)' : 'rgba(107,0,16,0.15)'}
          strokeWidth="1"
        />

        {/* Trend Polyline */}
        <Polyline
          points={polylineStr}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, idx) => (
          <Circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill={theme.background}
            stroke={strokeColor}
            strokeWidth="2"
          />
        ))}
      </Svg>

      <View style={styles.labelsRow}>
        {data.map((d, i) => (
          <View key={i} style={styles.labelCol}>
            <Text style={[styles.labelText, { color: theme.textMuted }]}>{d.label}</Text>
            <Text style={[styles.valText, { color: theme.text }]}>
              {d.value} {unit}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 4,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '92%',
    marginTop: 2,
  },
  labelCol: {
    alignItems: 'center',
  },
  labelText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  valText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
  },
});
