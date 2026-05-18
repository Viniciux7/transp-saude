import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { inicializarBanco } from '../database/db';

export default function RootLayout() {
  useEffect(() => {
    inicializarBanco();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
