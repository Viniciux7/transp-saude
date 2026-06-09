// app/cadastro.tsx
// Tela de cadastro: usuário cria uma nova conta.
// Toda a lógica de validação e Firebase fica no authController.

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cadastroController } from "../controllers/authController";
import { COLORS, FONTS, SPACING, globalStyles } from "../styles/global-styles";

export default function RegisterScreen() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCadastro() {
    setLoading(true);
    const resultado = await cadastroController(nome, email, senha);
    setLoading(false);

    if (!resultado.sucesso) {
      Alert.alert("Erro no cadastro", resultado.erro);
      return;
    }

    router.replace("/home");
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBackground} />

      <LinearGradient
        colors={[COLORS.oxfordNavy, COLORS.darkBackground]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Cabeçalho */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Criar conta</Text>
                <Text style={styles.headerSubtitle}>
                  Preencha seus dados para se cadastrar
                </Text>
              </View>

              {/* Formulário */}
              <View style={styles.form}>
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="person" size={20} color={COLORS.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Nome completo *"
                    placeholderTextColor={COLORS.coolSteel}
                    value={nome}
                    onChangeText={setNome}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="email" size={20} color={COLORS.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="E-mail *"
                    placeholderTextColor={COLORS.coolSteel}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="lock" size={20} color={COLORS.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Senha (mínimo 6 caracteres) *"
                    placeholderTextColor={COLORS.coolSteel}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!mostrarSenha}
                  />
                  <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                    <MaterialIcons
                      name={mostrarSenha ? "visibility-off" : "visibility"}
                      size={20}
                      color={COLORS.coolSteel}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[globalStyles.buttonPrimary, loading && { opacity: 0.7 }]}
                  onPress={handleCadastro}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.inkBlack} />
                  ) : (
                    <Text style={globalStyles.buttonPrimaryText}>Criar conta</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text style={globalStyles.linkText}>
                    Já tem conta? <Text style={styles.linkBold}>Entrar</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    marginBottom: SPACING.lg,
    alignSelf: "flex-start",
  },
  headerTitle: {
    fontSize: FONTS.size2XL,
    fontWeight: FONTS.weightBold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONTS.sizeMD,
    color: COLORS.coolSteel,
  },
  form: {
    flex: 1,
  },
  linkBold: {
    color: COLORS.accent,
    fontWeight: FONTS.weightBold,
  },
});
