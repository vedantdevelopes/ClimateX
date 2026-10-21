import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ActionDefinition } from '../data/actions';
import { useUser } from '../store/useUser';
import { lightTheme, darkTheme, colors } from '../theme/tokens';
import { Card } from './Card';

interface ActionItemProps {
  action: ActionDefinition;
  isDone: boolean;
  onToggle: (action: ActionDefinition) => void;
}

export const ActionItem: React.FC<ActionItemProps> = ({ action, isDone, onToggle }) => {
  const themeMode = useUser((s) => s.profile.theme);
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  let difficultyColor = colors.ok;
  if (action.difficulty === 'Medium') difficultyColor = colors.warn;
  if (action.difficulty === 'Challenging') difficultyColor = colors.danger;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        {/* Checkbox Target */}
        <TouchableOpacity
          style={[
            styles.checkbox,
            {
              borderColor: isDone ? colors.teal : theme.cardBorder,
              backgroundColor: isDone ? colors.teal : 'transparent',
            },
          ]}
          onPress={() => onToggle(action)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isDone }}
          accessibilityLabel={`Mark ${action.title} as ${isDone ? 'incomplete' : 'done'}`}
        >
          {isDone ? <Feather name="check" size={16} color="#FFFFFF" /> : null}
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={[styles.diffBadge, { borderColor: difficultyColor }]}>
              <Text style={[styles.diffText, { color: difficultyColor }]}>
                {action.difficulty.toUpperCase()}
              </Text>
            </View>

            {action.kgSaved > 0 ? (
              <View style={[styles.kgBadge, { backgroundColor: isDark ? 'rgba(42,157,143,0.2)' : 'rgba(42,157,143,0.15)' }]}>
                <Feather name="trending-down" size={11} color={colors.teal} />
                <Text style={[styles.kgText, { color: colors.teal }]}>
                  -{action.kgSaved} kg CO₂e
                </Text>
              </View>
            ) : action.riskMitigation ? (
              <View style={[styles.kgBadge, { backgroundColor: isDark ? 'rgba(255,221,221,0.15)' : 'rgba(107,0,16,0.1)' }]}>
                <Feather name="shield" size={11} color={theme.text} />
                <Text style={[styles.kgText, { color: theme.text }]}>
                  {action.riskMitigation}
                </Text>
              </View>
            ) : null}
          </View>

          <Text
            style={[
              styles.title,
              {
                color: theme.text,
                textDecorationLine: isDone ? 'line-through' : 'none',
                opacity: isDone ? 0.6 : 1,
              },
            ]}
          >
            {action.title}
          </Text>

          <Text style={[styles.why, { color: theme.textMuted }]}>{action.why}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 1.5,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  diffBadge: {
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginRight: 6,
  },
  diffText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  kgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  kgText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    marginLeft: 3,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 3,
  },
  why: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
});
