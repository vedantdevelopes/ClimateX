import { TextStyle } from 'react-native';

export const typography = {
  fonts: {
    display: 'Anton_400Regular',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    bodySemiBold: 'Inter_600SemiBold',
    bodyBold: 'Inter_700Bold',
  },
  displayLarge: {
    fontFamily: 'Anton_400Regular',
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1,
    textTransform: 'uppercase',
  } as TextStyle,
  displayMedium: {
    fontFamily: 'Anton_400Regular',
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -1,
    textTransform: 'uppercase',
  } as TextStyle,
  displaySmall: {
    fontFamily: 'Anton_400Regular',
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  } as TextStyle,
  subheading: {
    fontFamily: 'Anton_400Regular',
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  } as TextStyle,
  bodyLarge: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 22,
  } as TextStyle,
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,
  caption: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,
  badge: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  } as TextStyle,
};
