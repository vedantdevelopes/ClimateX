import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useUser } from '../store/useUser';
import { lightTheme, darkTheme, colors } from '../theme/tokens';

export interface BarDatum {
  label: string;
  value: number;
  secondaryLabel?: string;
  color?: string;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
  orientation?: 'horizontal' | 'vertical';
  unit?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 140,
  orientation = 'horizontal',
  unit = '',
}) => {
  const themeMode = useUser((s) => s.profile.theme);
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  if (orientation === 'vertical') {
    return (
      <View style={[styles.verticalContainer, { height }]}>
        <View style={styles.verticalBarsRow}>
          {data.map((item, index) => {
            const heightPercent = Math.min(100, Math.round((item.value / maxValue) * 100));
            const barColor = item.color || colors.teal;
            return (
              <View key={index} style={styles.verticalCol}>
                <Text style={[styles.valueTextSmall, { color: theme.textMuted }]}>
                  {item.value}
                </Text>
                <View style={styles.verticalTrack}>
                  <View
                    style={[
                      styles.verticalFill,
                      {
                        height: `${Math.max(6, heightPercent)}%`,
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.labelSmall, { color: theme.text }]}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  // Horizontal orientation
  return (
    <View style={styles.horizontalContainer}>
      {data.map((item, index) => {
        const widthPercent = Math.min(100, Math.round((item.value / maxValue) * 100));
        const barColor = item.color || colors.maroon;

        return (
          <View key={index} style={styles.row}>
            <View style={styles.rowHeader}>
              <Text style={[styles.labelText, { color: theme.text }]}>{item.label}</Text>
              <Text style={[styles.valueText, { color: theme.textMuted }]}>
                {item.value} {unit} {item.secondaryLabel ? `(${item.secondaryLabel})` : ''}
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: isDark ? 'rgba(255,221,221,0.1)' : 'rgba(107,0,16,0.08)' }]}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.max(3, widthPercent)}%`,
                    backgroundColor: barColor,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    width: '100%',
    paddingVertical: 6,
  },
  row: {
    marginVertical: 6,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  labelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  valueText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  track: {
    height: 8,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  verticalContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  verticalBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  verticalCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  verticalTrack: {
    width: 14,
    height: '65%',
    backgroundColor: 'rgba(107,0,16,0.08)',
    borderRadius: 2,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginVertical: 4,
  },
  verticalFill: {
    width: '100%',
    borderRadius: 2,
  },
  valueTextSmall: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    marginBottom: 2,
  },
  labelSmall: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    textTransform: 'uppercase',
  },
});
