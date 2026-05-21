import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { cadastrarUsuario } from "../database/userService";
import { colors, fonts, spacing, globalStyles } from "../styles/global-styles";

function formatCpf(value: string): string {
  const n = value.replace(/\D/g, "").slice(0, 11);
  return n
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatDate(value: string): string {
  const n = value.replace(/\D/g, "").slice(0, 8);
  return n.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2");
}

function validateCpf(cpf: string): boolean {
  const n = cpf.replace(/\D/g, "");
  if (n.length !== 11) return false;
  if (/^(\d)\1+$/.test(n)) return false;

  const calc = (slice: string, peso: number) => {
    const soma = slice.split("").reduce((acc, d, i) => acc + parseInt(d) * (peso - i), 0);
    const resto = (soma * 10) % 11;
    return resto >= 10 ? 0 : resto;
  };

  return calc(n.slice(0, 9), 10) === parseInt(n[9]) &&
         calc(n.slice(0, 10), 11) === parseInt(n[10]);
}

function validateDate(date: string): boolean {
  if (date.length !== 10) return false;
  const [day, month, year] = date.split("/").map(Number);
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day &&
    year >= 1900 &&
    year <= new Date().getFullYear()
  );
}

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCpfChange = (t: string) => setCpf(formatCpf(t));
  const handleDateChange = (t: string) => setBirthDate(formatDate(t));

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert("Atenção", "Informe seu nome completo.");
      return;
    }
    if (!validateCpf(cpf)) {
      Alert.alert("CPF inválido", "Verifique os números do CPF.");
      return;
    }
    if (!validateDate(birthDate)) {
      Alert.alert("Data inválida", "Informe uma data de nascimento válida.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const result = await cadastrarUsuario({ nome: name, cpf, dataNascimento: birthDate, senha: password });

    setLoading(false);

    if (!result.sucesso) {
      Alert.alert("Erro no cadastro", result.erro);
      return;
    }

    Alert.alert("Cadastro realizado!", "Sua conta foi criada com sucesso. Faça login para continuar.", [
      { text: "OK", onPress: () => router.replace("/login") },
    ]);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBackground} />

      <LinearGradient
        colors={[colors.oxfordNavy, colors.darkBackground]}
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
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <MaterialIcons name="arrow-back" size={24} color={colors.white} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Criar conta</Text>
                <Text style={styles.headerSubtitle}>
                  Preencha seus dados para se cadastrar
                </Text>
              </View>

              <View style={styles.form}>
                {/* Name */}
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="person" size={20} color={colors.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Nome completo"
                    placeholderTextColor={colors.coolSteel}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>

                {/* CPF */}
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="badge" size={20} color={colors.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="CPF (000.000.000-00)"
                    placeholderTextColor={colors.coolSteel}
                    value={cpf}
                    onChangeText={handleCpfChange}
                    keyboardType="number-pad"
                    maxLength={14}
                  />
                </View>

                {/* Birth date */}
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="calendar-today" size={20} color={colors.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Data de nascimento (DD/MM/AAAA)"
                    placeholderTextColor={colors.coolSteel}
                    value={birthDate}
                    onChangeText={handleDateChange}
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                </View>

                {/* Password */}
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="lock" size={20} color={colors.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Senha (mínimo 6 caracteres)"
                    placeholderTextColor={colors.coolSteel}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons
                      name={showPassword ? "visibility-off" : "visibility"}
                      size={20}
                      color={colors.coolSteel}
                    />
                  </TouchableOpacity>
                </View>

                {/* Button */}
                <TouchableOpacity
                  style={[globalStyles.buttonPrimary, loading && { opacity: 0.7 }]}
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.inkBlack} />
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.lg,
    alignSelf: "flex-start",
  },
  headerTitle: {
    fontSize: fonts.size2XL,
    fontWeight: fonts.weightBold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fonts.sizeMD,
    color: colors.coolSteel,
  },
  form: {
    flex: 1,
  },
  linkBold: {
    color: colors.accent,
    fontWeight: fonts.weightBold,
  },
});
