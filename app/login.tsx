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
import { buscarUsuarioPorEmail } from "../database/usuarioService";
import { COLORS, FONTS, SPACING, globalStyles } from "../styles/global-styles";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    setLoading(true);

    const usuario = buscarUsuarioPorEmail(email);

    setLoading(false);

    if (!usuario) {
      Alert.alert("Conta não encontrada", "Este e-mail não está cadastrado.");
      return;
    }

    if (usuario.senha !== senha) {
      Alert.alert("Senha inválida", "Verifique sua senha e tente novamente.");
      return;
    }

    router.replace("/home");
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.darkBackground}
      />

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
            >
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color={COLORS.white}
                  />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Entrar</Text>
                <Text style={styles.headerSubtitle}>
                  Acesse sua conta para solicitar transporte
                </Text>
              </View>

              <View style={styles.form}>
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons
                    name="email"
                    size={20}
                    color={COLORS.coolSteel}
                    style={globalStyles.inputIcon}
                  />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="E-mail"
                    placeholderTextColor={COLORS.coolSteel}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons
                    name="lock"
                    size={20}
                    color={COLORS.coolSteel}
                    style={globalStyles.inputIcon}
                  />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Senha"
                    placeholderTextColor={COLORS.coolSteel}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!mostrarSenha}
                  />
                  <TouchableOpacity
                    onPress={() => setMostrarSenha(!mostrarSenha)}
                  >
                    <MaterialIcons
                      name={mostrarSenha ? "visibility-off" : "visibility"}
                      size={20}
                      color={COLORS.coolSteel}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    globalStyles.buttonPrimary,
                    loading && { opacity: 0.7 },
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.inkBlack} />
                  ) : (
                    <Text style={globalStyles.buttonPrimaryText}>Entrar</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/cadastro")}>
                  <Text style={globalStyles.linkText}>
                    Não tem conta?{" "}
                    <Text style={styles.linkBold}>Cadastre-se</Text>
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
    justifyContent: "center",
  },

  linkBold: {
    color: COLORS.accent,
    fontWeight: FONTS.weightBold,
  },
});
