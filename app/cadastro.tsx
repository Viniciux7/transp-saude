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
import { cadastrarUsuario } from "../database/firebase/usuarioService";
import { COLORS, FONTS, SPACING, globalStyles } from "../styles/global-styles";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert("Atenção", "Nome é obrigatório.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Atenção", "Formato de e-mail incorreto.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Atenção", "Senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const result = await cadastrarUsuario({
      nome: name,
      email,
      senha: password,
    });

    setLoading(false);

    if (!result.sucesso) {
      Alert.alert("Erro no cadastro", result.erro);
      return;
    }

    Alert.alert(
      "Cadastro realizado com sucesso!",
      "Faça login para continuar.",
      [{ text: "OK", onPress: () => router.replace("/login") }],
    );
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
              showsVerticalScrollIndicator={false}
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

                <Text style={styles.headerTitle}>Criar conta</Text>
                <Text style={styles.headerSubtitle}>
                  Preencha seus dados para se cadastrar
                </Text>
              </View>

              <View style={styles.form}>
                {/* Nome */}
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons
                    name="person"
                    size={20}
                    color={COLORS.coolSteel}
                    style={globalStyles.inputIcon}
                  />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Nome completo *"
                    placeholderTextColor={COLORS.coolSteel}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>

                {/* Email */}
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons
                    name="email"
                    size={20}
                    color={COLORS.coolSteel}
                    style={globalStyles.inputIcon}
                  />
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

                {/* Senha */}
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons
                    name="lock"
                    size={20}
                    color={COLORS.coolSteel}
                    style={globalStyles.inputIcon}
                  />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Senha (mínimo 6 caracteres) *"
                    placeholderTextColor={COLORS.coolSteel}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons
                      name={showPassword ? "visibility-off" : "visibility"}
                      size={20}
                      color={COLORS.coolSteel}
                    />
                  </TouchableOpacity>
                </View>

                {/* Botão */}
                <TouchableOpacity
                  style={[
                    globalStyles.buttonPrimary,
                    loading && { opacity: 0.7 },
                  ]}
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.inkBlack} />
                  ) : (
                    <Text style={globalStyles.buttonPrimaryText}>
                      Criar conta
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Link para login */}
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
