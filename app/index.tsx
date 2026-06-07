import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SPACING, globalStyles } from "../styles/global-styles";

export default function IndexScreen() {
  const router = useRouter();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBackground} />

      <LinearGradient
        colors={[COLORS.oxfordNavy, COLORS.darkBackground]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.logoSection}>
            <Image
              source={require("../assets/images/brasao.png")}
              style={styles.brasao}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textSection}>
            <Text style={globalStyles.title}>Transporte São Simão</Text>
            <Text style={globalStyles.subtitle}>Nossa cidade em movimento</Text>
            <View style={globalStyles.divider} />
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={globalStyles.buttonSecondary}
              activeOpacity={0.8}
              onPress={() => router.push("/cadastro")}
            >
              <Text style={globalStyles.buttonSecondaryText}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={globalStyles.buttonPrimary}
              activeOpacity={0.8}
              onPress={() => router.push("/login")}
            >
              <Text style={globalStyles.buttonPrimaryText}>Entrar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            Prefeitura Municipal de São Simão - SP
          </Text>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },

  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  brasao: {
    width: 160,
    height: 160,
  },

  textSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  buttonSection: {
    width: "100%",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  footer: {
    fontSize: FONTS.sizeXS,
    color: COLORS.coolSteel,
    textAlign: "center",
  },
});
