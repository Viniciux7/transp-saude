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

function formatarCPF(valor: string): string {
  const n = valor.replace(/\D/g, '').slice(0, 11);
  return n
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatarData(valor: string): string {
  const n = valor.replace(/\D/g, '').slice(0, 8);
  return n
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
}

function validarCPF(cpf: string): boolean {
  const n = cpf.replace(/\D/g, '');
  if (n.length !== 11) return false;
  if (/^(\d)\1+$/.test(n)) return false;

  const calc = (slice: string, peso: number) => {
    const soma = slice.split('').reduce((acc, d, i) => acc + parseInt(d) * (peso - i), 0);
    const resto = (soma * 10) % 11;
    return resto >= 10 ? 0 : resto;
  };

  return calc(n.slice(0, 9), 10) === parseInt(n[9])
      && calc(n.slice(0, 10), 11) === parseInt(n[10]);
}

function validarData(data: string): boolean {
  if (data.length !== 10) return false;
  const [dia, mes, ano] = data.split('/').map(Number);
  const d = new Date(ano, mes - 1, dia);
  return (
    d.getFullYear() === ano &&
    d.getMonth()    === mes - 1 &&
    d.getDate()     === dia &&
    ano >= 1900 &&
    ano <= new Date().getFullYear()
  );
}

export default function CadastroScreen() {
  const router = useRouter();

  const [nome, setNome]                     = useState('');
  const [cpf, setCpf]                       = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha]                   = useState('');
  const [mostrarSenha, setMostrarSenha]     = useState(false);
  const [loading, setLoading]               = useState(false);

  const handleCpfChange  = (t: string) => setCpf(formatarCPF(t));
  const handleDataChange = (t: string) => setDataNascimento(formatarData(t));

  const handleCadastro = () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe seu nome completo.');
      return;
    }
    if (!validarCPF(cpf)) {
      Alert.alert('CPF inválido', 'Verifique os números do CPF.');
      return;
    }
    if (!validarData(dataNascimento)) {
      Alert.alert('Data inválida', 'Informe uma data de nascimento válida.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    const resultado = cadastrarUsuario({ nome, cpf, dataNascimento, senha });

    setLoading(false);

    if (!resultado.sucesso) {
      Alert.alert('Erro no cadastro', resultado.erro);
      return;
    }

    Alert.alert(
      'Cadastro realizado!',
      'Sua conta foi criada com sucesso. Faça login para continuar.',
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
                  <MaterialIcons name="person" size={20} color={COLORS.textMuted} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Nome completo"
                    placeholderTextColor={COLORS.textMuted}
                    value={nome}
                    onChangeText={setNome}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="badge" size={20} color={COLORS.textMuted} style={globalStyles.inputIcon} />
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

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="calendar-today" size={20} color={COLORS.textMuted} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Data de nascimento (DD/MM/AAAA)"
                    placeholderTextColor={COLORS.textMuted}
                    value={dataNascimento}
                    onChangeText={handleDataChange}
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                </View>

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="lock" size={20} color={COLORS.textMuted} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Senha (mínimo 6 caracteres)"
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
