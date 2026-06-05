import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../styles/global-styles";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo ao Transporte São Simão</Text>
    </View>
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
