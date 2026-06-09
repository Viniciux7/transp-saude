// app/painel.tsx — tela exclusiva do admin para aprovar/recusar transportes

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
  atualizarStatusViagem,
  escutarTodasViagens,
  fazerLogout,
} from "../database/firebase/usuarioService";
import { COLORS, FONTS, SPACING } from "../styles/global-styles";

type StatusViagem = "pending" | "confirmed" | "rejected";

const statusConfig: Record<
  StatusViagem,
  { cor: string; label: string; icone: keyof typeof MaterialIcons.glyphMap }
> = {
  pending:   { cor: "#F59E0B", label: "Pendente",   icone: "hourglass-empty" },
  confirmed: { cor: "#10B981", label: "Confirmado", icone: "check-circle"    },
  rejected:  { cor: "#EF4444", label: "Recusado",   icone: "cancel"          },
};

const veiculoLabel: Record<string, string> = {
  onibus: "Ônibus",
  van: "Van",
};

function CardSolicitacao({ viagem }: { viagem: Viagem }) {
  const config = statusConfig[viagem.status as StatusViagem] ?? statusConfig.pending;
  const isPending = viagem.status === "pending";

  async function handleAprovar() {
    try {
      await atualizarStatusViagem(viagem.id, "confirmed");
    } catch {
      Alert.alert("Erro", "Não foi possível aprovar. Tente novamente.");
    }
  }

  async function handleRecusar() {
    try {
      await atualizarStatusViagem(viagem.id, "rejected");
    } catch {
      Alert.alert("Erro", "Não foi possível recusar. Tente novamente.");
    }
  }

  return (
    <View style={cardStyles.container}>
      <View style={[cardStyles.faixaStatus, { backgroundColor: config.cor }]} />
      <View style={cardStyles.corpo}>

        {/* Linha superior: nome + badge */}
        <View style={cardStyles.topo}>
          <Text style={cardStyles.nomePaciente}>{viagem.nomePaciente}</Text>
          <View style={[cardStyles.badge, { backgroundColor: config.cor + "22" }]}>
            <MaterialIcons name={config.icone} size={12} color={config.cor} />
            <Text style={[cardStyles.badgeText, { color: config.cor }]}>
              {config.label}
            </Text>
          </View>
        </View>

        {/* Detalhes */}
        <View style={cardStyles.infoRow}>
          <MaterialIcons name="local-hospital" size={13} color="#6B7280" />
          <Text style={cardStyles.infoTexto}>{viagem.hospital}</Text>
        </View>

        <View style={cardStyles.infoRow}>
          <MaterialIcons name="directions-bus" size={13} color="#6B7280" />
          <Text style={cardStyles.infoTexto}>
            {veiculoLabel[viagem.veiculo] ?? viagem.veiculo} · {viagem.horario}
          </Text>
        </View>

        <View style={cardStyles.infoRow}>
          <MaterialIcons name="location-on" size={13} color="#6B7280" />
          <Text style={cardStyles.infoTexto}>{viagem.pontoEmbarque}</Text>
        </View>

        {!!viagem.nomeAcompanhante && (
          <View style={cardStyles.infoRow}>
            <MaterialIcons name="people" size={13} color="#6B7280" />
            <Text style={cardStyles.infoTexto}>
              Acomp.: {viagem.nomeAcompanhante}
            </Text>
          </View>
        )}

        {/* Botões de ação — só para pendentes */}
        {isPending && (
          <View style={cardStyles.botoesRow}>
            <TouchableOpacity
              style={[cardStyles.botao, cardStyles.botaoAprovar]}
              onPress={handleAprovar}
              activeOpacity={0.8}
            >
              <MaterialIcons name="check" size={16} color="#fff" />
              <Text style={cardStyles.botaoTexto}>Aprovar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[cardStyles.botao, cardStyles.botaoRecusar]}
              onPress={handleRecusar}
              activeOpacity={0.8}
            >
              <MaterialIcons name="close" size={16} color="#fff" />
              <Text style={cardStyles.botaoTexto}>Recusar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  faixaStatus: { width: 5 },
  corpo: { flex: 1, padding: 14 },
  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nomePaciente: { fontSize: 15, fontWeight: "700", color: "#1F2937", flex: 1, marginRight: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  infoTexto: { fontSize: 13, color: "#6B7280", flex: 1 },
  botoesRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  botao: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoAprovar: { backgroundColor: "#10B981" },
  botaoRecusar: { backgroundColor: "#EF4444" },
  botaoTexto: { color: "#fff", fontSize: 13, fontWeight: "700" },
});

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function PainelScreen() {
  const router = useRouter();
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = escutarTodasViagens(
      (dados) => { setViagens(dados); setCarregando(false); },
      (erro) => { console.error("Erro ao buscar viagens:", erro); setCarregando(false); },
    );
    return unsubscribe;
  }, []);

  async function handleSair() {
    try {
      await fazerLogout();
      router.replace("/");
    } catch {
      Alert.alert("Erro", "Não foi possível sair.");
    }
  }

  const pendentes = viagens.filter((v) => v.status === "pending").length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>Painel Admin</Text>
          <Text style={styles.subtitulo}>
            {pendentes} solicitação(ões) pendente(s)
          </Text>
        </View>
        <TouchableOpacity onPress={handleSair} style={styles.btnSair}>
          <MaterialIcons name="logout" size={22} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <View style={styles.conteudo}>
        {carregando ? (
          <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={viagens}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CardSolicitacao viagem={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <View style={styles.vazio}>
                <MaterialIcons name="inbox" size={52} color="#D1D5DB" />
                <Text style={styles.vazioTexto}>Nenhuma solicitação</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    backgroundColor: COLORS.oxfordNavy,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    flexDirection: "row",
    alignItems: "center",
  },
  titulo: { color: COLORS.white, fontSize: FONTS.sizeLG, fontWeight: "800" },
  subtitulo: { color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 2 },
  btnSair: { padding: 8 },
  conteudo: { flex: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  vazio: { alignItems: "center", paddingTop: 48, gap: 8 },
  vazioTexto: { fontSize: 15, fontWeight: "600", color: "#9CA3AF", marginTop: 8 },
});
