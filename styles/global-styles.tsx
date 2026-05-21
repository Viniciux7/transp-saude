import { StyleSheet } from "react-native";

export const COLORS = {
  oxfordNavy: "#003366",
  pearlAqua: "#A4D1CA",
  inkBlack: "#11181C",
  white: "#FFFFFF",
  coolSteel: "#9BA1A6",
  darkBackground: "#001A33",
  accent: "#4FD1C5",
  accentDark: "#38B2AC",
  primary: "#003366",
  bgDark: "#001A33",
  textMuted: "#9BA1A6",
  textDark: "#11181C",
};

export const FONTS = {
  sizeXS: 12,
  sizeSM: 14,
  sizeMD: 16,
  sizeLG: 20,
  sizeXL: 26,
  size2XL: 32,

  weightRegular: "400" as const,
  weightMedium: "500" as const,
  weightBold: "700" as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  pill: 30,
};

export const colors = COLORS;
export const fonts = FONTS;
export const spacing = SPACING;
export const radius = RADIUS;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
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
    alignItems: "center",
    width: "100%",
    marginTop: SPACING.sm,
  },

  buttonPrimaryText: {
    color: COLORS.inkBlack,
    fontSize: FONTS.sizeMD,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  buttonSecondary: {
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginTop: SPACING.sm,
  },

  buttonSecondaryText: {
    color: COLORS.white,
    fontSize: FONTS.sizeMD,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  title: {
    fontSize: FONTS.size2XL,
    fontWeight: FONTS.weightBold,
    color: COLORS.white,
    textAlign: "center",
  },

  subtitle: {
    fontSize: FONTS.sizeMD,
    color: COLORS.coolSteel,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: SPACING.xs,
  },

  linkText: {
    color: COLORS.accent,
    fontSize: FONTS.sizeSM,
    textAlign: "center",
    marginTop: SPACING.md,
  },

  divider: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: SPACING.lg,
  },

  errorText: {
    fontSize: FONTS.sizeSM,
    color: "red",
    fontWeight: FONTS.weightMedium,
    textAlign: "center",
    marginTop: SPACING.sm,
  },

  requiredMark: {
    color: "red",
    fontWeight: FONTS.weightBold,
    marginLeft: SPACING.xs,
  },
});
