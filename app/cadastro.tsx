import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { cadastrarUsuario } from '../database/userService';
import { COLORS, FONTS, SPACING, globalStyles } from '../styles/global-styles';

function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CadastroScreen() {
  const router = useRouter();

  const [nome, setNome]                 = useState('');
  const [email, setEmail]               = useState('');
  const [senha, setSenha]               = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading]           = useState(false);

  const handleCadastro = () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Nome é obrigatório.');
      return;
    }
    if (!validarEmail(email)) {
      Alert.alert('Atenção', 'Formato de e-mail incorreto.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'Senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    const resultado = cadastrarUsuario({ nome, email, senha });

    setLoading(false);

    if (!resultado.sucesso) {
      Alert.alert('Erro no cadastro', resultado.erro);
      return;
    }

    Alert.alert(
      'Cadastro realizado com sucesso!',
      'Faça login para continuar.',
      [{ text: 'OK', onPress: () => router.replace('/login') }]
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />

      <LinearGradient
        colors={[COLORS.primary, COLORS.bgDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                  <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Criar conta</Text>
                <Text style={styles.headerSubtitle}>
                  Preencha seus dados para se cadastrar
                </Text>
              </View>

              <View style={styles.form}>

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons
                    name="person"
                    size={20}
                    color={COLORS.textMuted}
                    style={globalStyles.inputIcon}
                  />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Nome completo *"
                    placeholderTextColor={COLORS.textMuted}
                    value={nome}
                    onChangeText={setNome}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons
                    name="email"
                    size={20}
                    color={COLORS.textMuted}
                    style={globalStyles.inputIcon}
                  />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="E-mail *"
                    placeholderTextColor={COLORS.textMuted}
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
                    color={COLORS.textMuted}
                    style={globalStyles.inputIcon}
                  />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Senha (mínimo 6 caracteres) *"
                    placeholderTextColor={COLORS.textMuted}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!mostrarSenha}
                  />
                  <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                    <MaterialIcons
                      name={mostrarSenha ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={COLORS.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[globalStyles.buttonPrimary, loading && { opacity: 0.7 }]}
                  onPress={handleCadastro}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading
                    ? <ActivityIndicator color={COLORS.textDark} />
                    : <Text style={globalStyles.buttonPrimaryText}>Criar conta</Text>
                  }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={globalStyles.linkText}>
                    Já tem conta?{' '}
                    <Text style={styles.linkBold}>Entrar</Text>
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
    alignSelf: 'flex-start',
  },

  headerTitle: {
    fontSize: FONTS.size2XL,
    fontWeight: FONTS.weightBold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },

  headerSubtitle: {
    fontSize: FONTS.sizeMD,
    color: COLORS.textMuted,
  },

  form: {
    flex: 1,
  },

  linkBold: {
    color: COLORS.accent,
    fontWeight: FONTS.weightBold,
  },
});
