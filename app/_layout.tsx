import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (/**
 * app/_layout.tsx — Layout Raiz
 *
 * Este é o ponto de entrada do Expo Router.
 * Todo app Expo Router tem um _layout.tsx na raiz da pasta app/.
 *
 * Ele faz duas coisas:
 *   1. Inicializa o banco SQLite (cria as tabelas na primeira abertura)
 *   2. Define a estrutura de navegação (quais telas existem)
 *
 * ─── O QUE É useEffect? ─────────────────────────────────────
 * useEffect é um hook do React que executa uma função
 * DEPOIS que o componente aparece na tela.
 *
 * useEffect(() => {
 *   // código que roda após a tela aparecer
 * }, []);          ← array vazio = roda só uma vez (na montagem)
 *
 * Usamos ele para inicializar o banco porque não queremos bloquear
 * a renderização da tela enquanto o banco abre.
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { inicializarBanco } from '../database/db';

export default function RootLayout() {
  // Inicializa o banco assim que o app abre.
  // O array vazio [] garante que isso roda apenas UMA vez.
  useEffect(() => {
    inicializarBanco();
  }, []);

  return (
    /**
     * Stack é o navegador padrão do Expo Router.
     * Funciona como uma pilha de telas: cada nova tela empilha em cima.
     * O botão "voltar" desempilha (volta para a tela anterior).
     *
     * screenOptions={{ headerShown: false }}:
     * Remove o cabeçalho padrão do React Navigation de todas as telas.
     * Fazemos nosso próprio cabeçalho em cada tela para ter controle total.
     */
    <Stack screenOptions={{ headerShown: false }} />
  );
}

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
