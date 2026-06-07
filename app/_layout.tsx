import { Stack } from "expo-router";
// import { inicializarBanco } from "../database/sqlite";

export default function RootLayout() {
  // useEffect(() => {
  //   inicializarBanco();
  // }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}