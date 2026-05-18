/**
 * app/index.tsx — Tela Splash
 *
 * Primeira tela que o usuário vê.
 * Mostra o brasão, o nome do app e dois botões: CADASTRAR e ENTRAR.
 * Fiel ao design da foto enviada.
 *
 * Componentes usados:
 *   - LinearGradient: gradiente de fundo azul escuro → azul médio
 *   - Image: brasão da cidade
 *   - TouchableOpacity: botão com feedback de toque (fica levemente transparente)
 *   - useRouter: hook do Expo Router para navegar entre telas
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING, globalStyles } from '../styles/global-styles';

export default function IndexScreen() {
  // useRouter dá acesso à navegação do Expo Router.
  // router.push('/login') → vai para app/login.tsx
  const router = useRouter();

  return (
    <>
      {/*
        StatusBar: controla a barra de status do celular (hora, bateria...).
        "light-content" deixa os ícones brancos — ideal para fundo escuro.
      */}
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />

      {/*
        LinearGradient: cria o gradiente de fundo.
        colors[0] = topo da tela, colors[1] = base da tela.
        start/end define a direção: de cima (y:0) para baixo (y:1).
      */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.bgDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {/*
          SafeAreaView: garante que o conteúdo não fique atrás
          da "notch" (entalhe) ou da barra de navegação do celular.
        */}
        <SafeAreaView style={styles.container}>

          {/* ── BRASÃO ──────────────────────────────── */}
          <View style={styles.logoSection}>
            {/*
              O brasão deve estar em assets/images/brasao.png
              resizeMode="contain" mantém a proporção original sem cortar.
            */}
            <Image
              source={require('../assets/images/brasao.png')}
              style={styles.brasao}
              resizeMode="contain"
            />
          </View>

          {/* ── TEXTOS ──────────────────────────────── */}
          <View style={styles.textSection}>
            <Text style={globalStyles.title}>Transporte São Simão</Text>
            <Text style={globalStyles.subtitle}>Nossa cidade em movimento</Text>
            {/* Linha divisória ciano, igual à foto */}
            <View style={globalStyles.divider} />
          </View>

          {/* ── BOTÕES ──────────────────────────────── */}
          <View style={styles.buttonSection}>
            {/*
              TouchableOpacity: ao tocar, o componente fica levemente
              transparente (activeOpacity controla o quanto).
              onPress chama router.push para navegar.
            */}
            <TouchableOpacity
              style={globalStyles.buttonSecondary}
              activeOpacity={0.8}
              onPress={() => router.push('/cadastro')}
            >
              <Text style={globalStyles.buttonSecondaryText}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={globalStyles.buttonPrimary}
              activeOpacity={0.8}
              onPress={() => router.push('/login')}
            >
              <Text style={globalStyles.buttonPrimaryText}>Entrar</Text>
            </TouchableOpacity>
          </View>

          {/* ── RODAPÉ ──────────────────────────────── */}
          <Text style={styles.footer}>Prefeitura Municipal de São Simão - SP</Text>

        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

// Estilos específicos desta tela.
// Os estilos compartilhados (botões, textos) vêm do global-styles.
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    // space-between: distribui os filhos com espaço igual entre eles,
    // encostando o primeiro no topo e o último na base.
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },

  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  brasao: {
    width: 160,
    height: 160,
  },

  textSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },

  buttonSection: {
    width: '100%',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  footer: {
    fontSize: FONTS.sizeXS,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
