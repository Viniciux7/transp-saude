/**
 * app/login.tsx — Tela de Login
 *
 * O usuário informa CPF e senha.
 * Buscamos o usuário no SQLite pelo CPF e comparamos a senha.
 * Se bater, redirecionamos conforme o role:
 *   - 'citizen' → /(tabs)/home   (tela dos colegas)
 *   - 'admin'   → /(admin)/painel (tela dos colegas)
 *
 * Conceitos novos aqui:
 *   - useState: guarda o que o usuário digita
 *   - KeyboardAvoidingView: sobe o conteúdo quando o teclado aparece
 *   - ActivityIndicator: spinner de "carregando"
 *   - Alert: caixa de diálogo nativa do celular
 */

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
import { buscarUsuarioPorCpf } from '../database/userService';
import { COLORS, FONTS, SPACING, globalStyles } from '../styles/global-styles';

// ─────────────────────────────────────────────────────────────
// MÁSCARA DE CPF
//
// Formata o texto enquanto o usuário digita.
// "12345678900" vira "123.456.789-00" automaticamente.
//
// Como funciona:
//   1. Remove tudo que não é número com replace(/\D/g, '')
//      \D = qualquer caractere que NÃO seja dígito
//      /g = aplica em toda a string (global)
//   2. Insere pontos e traço nas posições corretas
// ─────────────────────────────────────────────────────────────
function formatarCPF(valor: string): string {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);
  return numeros
    .replace(/(\d{3})(\d)/, '$1.$2')       // "123" + resto → "123."
    .replace(/(\d{3})(\d)/, '$1.$2')       // "123.456" + resto → "123.456."
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // "123.456.789" + resto → "123.456.789-"
}

export default function LoginScreen() {
  const router = useRouter();

  // ─────────────────────────────────────────────────────────────
  // ESTADO LOCAL (useState)
  //
  // useState cria uma variável "reativa": quando ela muda,
  // o React atualiza a tela automaticamente.
  //
  // const [valor, setValor] = useState(valorInicial)
  //   "valor"    → lê o dado atual
  //   "setValor" → função para atualizar
  // ─────────────────────────────────────────────────────────────
  const [cpf, setCpf]                     = useState('');
  const [senha, setSenha]                 = useState('');
  const [mostrarSenha, setMostrarSenha]   = useState(false);
  const [loading, setLoading]             = useState(false);

  const handleCpfChange = (texto: string) => {
    setCpf(formatarCPF(texto));
  };

  // ─────────────────────────────────────────────────────────────
  // FUNÇÃO DE LOGIN
  // ─────────────────────────────────────────────────────────────
  const handleLogin = () => {
    // Validação básica
    if (!cpf.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha CPF e senha para continuar.');
      return;
    }

    setLoading(true);

    // Busca o usuário no banco pelo CPF
    const usuario = buscarUsuarioPorCpf(cpf);

    setLoading(false);

    if (!usuario) {
      Alert.alert('CPF não encontrado', 'Este CPF não está cadastrado no app.');
      return;
    }

    // Verifica se a senha bate
    if (usuario.senha !== senha) {
      Alert.alert('Senha incorreta', 'Verifique sua senha e tente novamente.');
      return;
    }

    // Login bem-sucedido: redireciona conforme o perfil
    // router.replace em vez de router.push:
    //   push  → empilha a tela (usuário pode voltar com o botão voltar)
    //   replace → substitui (usuário NÃO pode voltar ao login após entrar)
    if (usuario.role === 'admin') {
      router.replace('/(admin)/painel');
    } else {
      router.replace('/(tabs)/home');
    }
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
          {/*
            KeyboardAvoidingView: quando o teclado aparece, ele empurra
            o conteúdo para cima para os inputs não ficarem escondidos.
            behavior="padding" é o modo correto para iOS.
            No Android, o sistema já faz isso automaticamente.
          */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              // keyboardShouldPersistTaps="handled":
              // permite tocar no botão mesmo com o teclado aberto,
              // sem precisar fechar o teclado primeiro.
              keyboardShouldPersistTaps="handled"
            >

              {/* ── CABEÇALHO ─────────────────────── */}
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Entrar</Text>
                <Text style={styles.headerSubtitle}>
                  Acesse sua conta para solicitar transporte
                </Text>
              </View>

              {/* ── FORMULÁRIO ────────────────────── */}
              <View style={styles.form}>

                {/* Campo CPF */}
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons
                    name="badge"
                    size={20}
                    color={COLORS.textMuted}
                    style={globalStyles.inputIcon}
                  />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="CPF (000.000.000-00)"
                    placeholderTextColor={COLORS.textMuted}
                    value={cpf}
                    onChangeText={handleCpfChange}
                    keyboardType="number-pad"
                    maxLength={14}
                  />
                </View>

                {/* Campo Senha */}
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons
                    name="lock"
                    size={20}
                    color={COLORS.textMuted}
                    style={globalStyles.inputIcon}
                  />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Senha"
                    placeholderTextColor={COLORS.textMuted}
                    value={senha}
                    onChangeText={setSenha}
                    // secureTextEntry=true → substitui os caracteres por bullets (●●●)
                    secureTextEntry={!mostrarSenha}
                  />
                  {/* Botão olho: alterna mostrarSenha entre true e false */}
                  <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                    <MaterialIcons
                      name={mostrarSenha ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={COLORS.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                {/* Botão de entrar */}
                <TouchableOpacity
                  style={[
                    globalStyles.buttonPrimary,
                    // Array de estilos: o segundo sobrescreve o primeiro
                    // quando loading=true, aplicamos opacidade reduzida
                    loading && { opacity: 0.7 },
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading
                    ? <ActivityIndicator color={COLORS.textDark} />
                    : <Text style={globalStyles.buttonPrimaryText}>Entrar</Text>
                  }
                </TouchableOpacity>

                {/* Link para cadastro */}
                <TouchableOpacity onPress={() => router.push('/cadastro')}>
                  <Text style={globalStyles.linkText}>
                    Não tem conta?{' '}
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
    // flexGrow: 1 permite que o ScrollView cresça para ocupar a tela,
    // mas não força altura mínima caso o conteúdo seja menor.
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
    justifyContent: 'center',
  },

  linkBold: {
    color: COLORS.accent,
    fontWeight: FONTS.weightBold,
  },
});
