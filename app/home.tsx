/**
 * app/home.tsx (ou app/(app)/home.tsx)
 *
 * Dashboard do cidadão com:
 *  - Saudação personalizada com nome real do Firebase
 *  - Botões de ação (pacientes e transporte)
 *  - Lista de viagens em tempo real via Firestore
 *  - Botão de logout
 */

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Viagem,
    escutarViagensDoCidadao,
    fazerLogout,
    primeiroNomeAtual,
} from "../database/firebase/usuarioService";
import { COLORS, FONTS, SPACING, globalStyles } from "../styles/global-styles";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS DE STATUS
// ─────────────────────────────────────────────────────────────────────────────

type StatusViagem = "pending" | "confirmed" | "rejected";

const statusConfig: Record<
  StatusViagem,
  { cor: string; label: string; icone: keyof typeof MaterialIcons.glyphMap }
> = {
  pending: { cor: "#F59E0B", label: "Pendente", icone: "hourglass-empty" },
  confirmed: { cor: "#10B981", label: "Confirmado", icone: "check-circle" },
  rejected: { cor: "#EF4444", label: "Recusado", icone: "cancel" },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: Card de Viagem
// ─────────────────────────────────────────────────────────────────────────────

function CardViagem({ viagem }: { viagem: Viagem }) {
  const config =
    statusConfig[viagem.status as StatusViagem] ?? statusConfig.pending;

  return (
    <View style={cardStyles.container}>
      <View style={[cardStyles.faixaStatus, { backgroundColor: config.cor }]} />
      <View style={cardStyles.corpo}>
        <View style={cardStyles.topo}>
          <View style={{ flex: 1 }}>
            <Text style={cardStyles.destino}>{viagem.destino}</Text>
            <Text style={cardStyles.data}>{viagem.dataViagem}</Text>
          </View>
          <View
            style={[cardStyles.badge, { backgroundColor: config.cor + "20" }]}
          >
            <MaterialIcons name={config.icone} size={12} color={config.cor} />
            <Text style={[cardStyles.badgeText, { color: config.cor }]}>
              {config.label}
            </Text>
          </View>
        </View>

        {viagem.acompanhante && (
          <View style={cardStyles.acompanhanteTag}>
            <MaterialIcons name="people" size={12} color="#6B7280" />
            <Text style={cardStyles.acompanhanteText}>Com acompanhante</Text>
          </View>
        )}

        {!!viagem.observacao && (
          <Text style={cardStyles.observacao} numberOfLines={2}>
            {viagem.observacao}
          </Text>
        )}
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  faixaStatus: { width: 5 },
  corpo: { flex: 1, padding: 14 },
  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  destino: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  data: { fontSize: 12, color: "#6B7280" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  acompanhanteTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  acompanhanteText: { fontSize: 12, color: "#6B7280" },
  observacao: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
    fontStyle: "italic",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// TELA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();

  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Primeiro nome do usuário logado (displayName do Firebase Auth)
  const primeiroNome = primeiroNomeAtual();

  // ── Listener em tempo real das viagens ──────────────────────────────────
  useEffect(() => {
    const unsubscribe = escutarViagensDoCidadao(
      (dados) => {
        setViagens(dados);
        setCarregando(false);
      },
      (erro) => {
        console.error("Erro ao buscar viagens:", erro);
        setCarregando(false);
      },
    );

    return unsubscribe; // remove o listener ao desmontar
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  function handleSair() {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await fazerLogout();
            router.replace("/");
          } catch {
            Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.saudacao}>Olá, {primeiroNome} 👋</Text>
          <Text style={styles.headerSubtitulo}>Bem-vindo ao TranspSaúde</Text>
        </View>
        <TouchableOpacity onPress={handleSair} style={styles.btnSair}>
          <MaterialIcons
            name="logout"
            size={22}
            color="rgba(255,255,255,0.8)"
          />
        </TouchableOpacity>
      </View>

      {/* ── Conteúdo ────────────────────────────────────────────────────── */}
      <View style={styles.conteudo}>
        {/* Botões de ação */}
        <TouchableOpacity
          style={globalStyles.buttonPrimary}
          activeOpacity={0.8}
          onPress={() => router.push("/pacientes")}
        >
          <Text style={globalStyles.buttonPrimaryText}>Cadastrar paciente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.buttonPrimary, { marginTop: SPACING.sm }]}
          activeOpacity={0.8}
          onPress={() => router.push("/transporte" as any)}
        >
          <Text style={globalStyles.buttonPrimaryText}>
            Cadastrar transporte
          </Text>
        </TouchableOpacity>

        {/* ── Minhas Viagens ────────────────────────────────────────────── */}
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Minhas Viagens</Text>
          <Text style={styles.secaoContador}>
            {viagens.length} solicitação(ões)
          </Text>
        </View>

        {carregando ? (
          <ActivityIndicator
            size="large"
            color={COLORS.accent}
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={viagens}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CardViagem viagem={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <View style={styles.listaVazia}>
                <MaterialIcons name="inbox" size={52} color="#D1D5DB" />
                <Text style={styles.listaVaziaText}>
                  Nenhuma viagem solicitada
                </Text>
                <Text style={styles.listaVaziaSubtext}>
                  Use "Cadastrar transporte" para fazer sua primeira
                  solicitação.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: COLORS.oxfordNavy ?? "#003366",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    flexDirection: "row",
    alignItems: "center",
  },
  saudacao: {
    color: COLORS.white,
    fontSize: FONTS.sizeLG ?? 18,
    fontWeight: "800",
  },
  headerSubtitulo: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    marginTop: 2,
  },
  btnSair: { padding: 8 },

  conteudo: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },

  secaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  secaoTitulo: { fontSize: 17, fontWeight: "700", color: "#1F2937" },
  secaoContador: { fontSize: 12, color: "#9CA3AF" },

  listaVazia: { alignItems: "center", paddingTop: 48, gap: 8 },
  listaVaziaText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 8,
  },
  listaVaziaSubtext: {
    fontSize: 13,
    color: "#D1D5DB",
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
