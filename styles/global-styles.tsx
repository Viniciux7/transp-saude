import { StyleSheet } from "react-native";

export const colors = {
  oxfordNavy: "#003366",   // primary
  pearlAqua: "#A4D1CA",    // secondary
  inkBlack: "#11181C",     // text dark
  white: "#FFFFFF",        // background / text light
  coolSteel: "#9BA1A6",    // muted text
  darkBackground: "#001A33", // extra (background contrast)
  accent: "#4FD1C5",         // extra (highlight)
  accentDark: "#38B2AC",     // extra (highlight darker)
};

export const fonts = {
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

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  pill: 30,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
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
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    height: 52,
  },

  inputIcon: {
    marginRight: spacing.sm,
  },

  input: {
    flex: 1,
    color: colors.white,
    fontSize: fonts.sizeMD,
  },

  buttonPrimary: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginTop: spacing.sm,
  },

  buttonPrimaryText: {
    color: colors.inkBlack,
    fontSize: fonts.sizeMD,
    fontWeight: fonts.weightBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  buttonSecondary: {
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginTop: spacing.sm,
  },

  buttonSecondaryText: {
    color: colors.white,
    fontSize: fonts.sizeMD,
    fontWeight: fonts.weightBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  title: {
    fontSize: fonts.size2XL,
    fontWeight: fonts.weightBold,
    color: colors.white,
    textAlign: "center",
  },

  subtitle: {
    fontSize: fonts.sizeMD,
    color: colors.coolSteel,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: spacing.xs,
  },

  linkText: {
    color: colors.accent,
    fontSize: fonts.sizeSM,
    textAlign: "center",
    marginTop: spacing.md,
  },

  divider: {
    width: 40,
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: spacing.lg,
  },

  errorText: {
    fontSize: fonts.sizeSM,
    color: "red",
    fontWeight: fonts.weightMedium,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  requiredMark: {
    color: "red",
    fontWeight: fonts.weightBold,
    marginLeft: spacing.xs,
  },
});
