import { StyleSheet } from 'react-native';

export const COLORS = {
  bgDark:     '#001a33', 
  primary:    '#003366', 
  accent:     '#4fd1c5', 
  accentDark: '#38b2ac', 
  white:      '#FFFFFF', 
  textDark:   '#11181c', 
  textMuted:  '#9ba1a6', 
};

export const FONTS = {
  sizeXS:  12, 
  sizeSM:  14,  
  sizeMD:  16,  
  sizeLG:  20,  
  sizeXL:  26,  
  size2XL: 32,  

  weightRegular: '400' as const,
  weightMedium:  '500' as const,
  weightBold:    '700' as const,
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const RADIUS = {
  sm:   8,
  md:   12,
  pill: 30,
};



export const globalStyles = StyleSheet.create({

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    height: 52,
  },

  inputIcon: {
    marginRight: SPACING.sm,
  },

  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: FONTS.sizeMD,
  },


  buttonPrimary: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: SPACING.sm,
  },

  buttonPrimaryText: {
    color: COLORS.textDark,
    fontSize: FONTS.sizeMD,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  buttonSecondary: {
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: SPACING.sm,
  },

  buttonSecondaryText: {
    color: COLORS.white,
    fontSize: FONTS.sizeMD,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  title: {
    fontSize: FONTS.size2XL,
    fontWeight: FONTS.weightBold,
    color: COLORS.white,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: FONTS.sizeMD,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },

  linkText: {
    color: COLORS.accent,
    fontSize: FONTS.sizeSM,
    textAlign: 'center',
    marginTop: SPACING.md,
  },



  divider: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: SPACING.lg,
  },
});