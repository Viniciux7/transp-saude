import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { COLORS, FONTS, globalStyles } from "../styles/global-styles";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text}>Bem-vindo ao Transporte São Simão</Text>
      </View>
        <TouchableOpacity
          style={globalStyles.buttonPrimary}
          activeOpacity={0.8}
          onPress={() => router.push("/pacientes")}
        >
        <Text style={globalStyles.buttonPrimaryText}>Cadastrar paciente</Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={globalStyles.buttonPrimary}
          activeOpacity={0.8}
          onPress={() => router.push("/transporte")}
        >
        <Text style={globalStyles.buttonPrimaryText}>Cadastrar transporte</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: COLORS.white,
    fontSize: FONTS.sizeLG,
    textAlign: "center",
  },
});
