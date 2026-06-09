// app/transportes.tsx

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { transporteController } from "../controllers/transporteController";
import { contarVagasOcupadas } from "../database/firebase/usuarioService";
import { COLORS, FONTS, SPACING, globalStyles } from "../styles/global-styles";

const ONIBUS_TOTAL = 42;
const VAN_TOTAL = 16;

const HORARIOS: Record<"onibus" | "van", string[]> = {
  onibus: ["05:00", "10:00"],
  van: ["06:00"],
};

const HOSPITAIS_ONIBUS = [
  "Hospital das Clínicas (HCC)",
  "AME",
  "Hospital Estadual RP (HERP)",
  "Beneficência Portuguesa",
  "9 de Julho",
  "Av Independência",
];

const HOSPITAIS_VAN = [...HOSPITAIS_ONIBUS, "Outro hospital"];

export default function TransportesScreen() {
  const router = useRouter();

  const [nomePaciente, setNomePaciente] = useState("");
  const [dataNascPaciente, setDataNascPaciente] = useState("");
  const [nomeAcompanhante, setNomeAcompanhante] = useState("");
  const [dataNascAcompanhante, setDataNascAcompanhante] = useState("");
  const [veiculo, setVeiculo] = useState<"onibus" | "van" | null>(null);
  const [horario, setHorario] = useState<string | null>(null);
  const [hospital, setHospital] = useState("");
  const [outroHospital, setOutroHospital] = useState("");
  const [pontoEmbarque, setPontoEmbarque] = useState("");
  const [loading, setLoading] = useState(false);
  const [vagasOcupadas, setVagasOcupadas] = useState<Record<string, number>>({});
  const [carregandoVagas, setCarregandoVagas] = useState(false);

  useEffect(() => {
    if (!veiculo) return;
    setHorario(null);
    setCarregandoVagas(true);

    Promise.all(
      HORARIOS[veiculo].map(async (h) => {
        const ocupadas = await contarVagasOcupadas(veiculo, h);
        return [h, ocupadas] as [string, number];
      })
    ).then((entries) => {
      setVagasOcupadas(Object.fromEntries(entries));
      setCarregandoVagas(false);
    });
  }, [veiculo]);

  const totalVagas = veiculo === "onibus" ? ONIBUS_TOTAL : VAN_TOTAL;
  const hospitais = veiculo === "van" ? HOSPITAIS_VAN : HOSPITAIS_ONIBUS;
  const hospitalFinal = hospital === "Outro hospital" ? outroHospital : hospital;

  async function handleSolicitar() {
    setLoading(true);
    const resultado = await transporteController({
      nomePaciente,
      dataNascPaciente,
      nomeAcompanhante,
      dataNascAcompanhante,
      hospital: hospitalFinal,
      pontoEmbarque,
      veiculo: veiculo!,
      horario: horario!,
    });
    setLoading(false);

    if (!resultado.sucesso) {
      Alert.alert("Atenção", resultado.erro);
      return;
    }

    Alert.alert("Solicitado!", "Sua solicitação foi enviada.", [
      { text: "OK", onPress: () => router.replace("/home") },
    ]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBackground} />
      <LinearGradient
        colors={[COLORS.oxfordNavy, COLORS.darkBackground]}
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
              {/* Cabeçalho */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Solicitar Transporte</Text>
                <Text style={styles.headerSubtitle}>
                  Preencha os dados para solicitar a viagem
                </Text>
              </View>

              {/* ── Dados do Paciente ── */}
              <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>Dados do Paciente</Text>

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="person" size={20} color={COLORS.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Nome completo *"
                    placeholderTextColor={COLORS.coolSteel}
                    value={nomePaciente}
                    onChangeText={setNomePaciente}
                    autoCapitalize="words"
                  />
                </View>

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="cake" size={20} color={COLORS.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Data de nascimento (DD/MM/AAAA) *"
                    placeholderTextColor={COLORS.coolSteel}
                    value={dataNascPaciente}
                    onChangeText={setDataNascPaciente}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
              </View>

              {/* ── Acompanhante ── */}
              <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>Acompanhante (opcional)</Text>

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="person-outline" size={20} color={COLORS.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Nome do acompanhante"
                    placeholderTextColor={COLORS.coolSteel}
                    value={nomeAcompanhante}
                    onChangeText={setNomeAcompanhante}
                    autoCapitalize="words"
                  />
                </View>

                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="cake" size={20} color={COLORS.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Data de nascimento do acompanhante"
                    placeholderTextColor={COLORS.coolSteel}
                    value={dataNascAcompanhante}
                    onChangeText={setDataNascAcompanhante}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
              </View>

              {/* ── Veículo ── */}
              <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>Veículo *</Text>
                <View style={styles.cardRow}>
                  <TouchableOpacity
                    style={[styles.veiculoCard, veiculo === "onibus" && styles.cardSelecionado]}
                    onPress={() => { setVeiculo("onibus"); setHospital(""); }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="directions-bus"
                      size={30}
                      color={veiculo === "onibus" ? COLORS.accent : COLORS.coolSteel}
                    />
                    <Text style={[styles.cardNome, veiculo === "onibus" && styles.cardNomeSelecionado]}>
                      Ônibus
                    </Text>
                    <Text style={styles.cardInfo}>{ONIBUS_TOTAL} lugares</Text>
                    <Text style={styles.cardInfo}>05h e 10h</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.veiculoCard, veiculo === "van" && styles.cardSelecionado]}
                    onPress={() => { setVeiculo("van"); setHospital(""); }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="airport-shuttle"
                      size={30}
                      color={veiculo === "van" ? COLORS.accent : COLORS.coolSteel}
                    />
                    <Text style={[styles.cardNome, veiculo === "van" && styles.cardNomeSelecionado]}>
                      Van
                    </Text>
                    <Text style={styles.cardInfo}>{VAN_TOTAL} lugares</Text>
                    <Text style={styles.cardInfo}>06h</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ── Horário ── */}
              {veiculo && (
                <View style={styles.secao}>
                  <Text style={styles.secaoTitulo}>Horário *</Text>
                  {carregandoVagas ? (
                    <ActivityIndicator color={COLORS.accent} style={{ marginVertical: 8 }} />
                  ) : (
                    <View style={styles.cardRow}>
                      {HORARIOS[veiculo].map((h) => {
                        const ocupadas = vagasOcupadas[h] ?? 0;
                        const disponiveis = totalVagas - ocupadas;
                        const cheio = disponiveis <= 0;
                        const selecionado = horario === h;

                        return (
                          <TouchableOpacity
                            key={h}
                            style={[
                              styles.horarioCard,
                              selecionado && styles.cardSelecionado,
                              cheio && styles.cardCheio,
                            ]}
                            onPress={() => !cheio && setHorario(h)}
                            activeOpacity={cheio ? 1 : 0.8}
                          >
                            <MaterialIcons
                              name="access-time"
                              size={22}
                              color={selecionado ? COLORS.accent : cheio ? "#6B7280" : COLORS.white}
                            />
                            <Text style={[
                              styles.horarioHora,
                              selecionado && { color: COLORS.accent },
                              cheio && { color: "#6B7280" },
                            ]}>
                              {h}
                            </Text>
                            <Text style={[styles.cardInfo, cheio && { color: "#EF4444" }]}>
                              {cheio ? "Esgotado" : `${disponiveis} vagas`}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}

              {/* ── Hospital ── */}
              {veiculo && (
                <View style={styles.secao}>
                  <Text style={styles.secaoTitulo}>Hospital de destino *</Text>
                  <View style={styles.chipLista}>
                    {hospitais.map((h) => (
                      <TouchableOpacity
                        key={h}
                        style={[styles.chip, hospital === h && styles.chipSelecionado]}
                        onPress={() => setHospital(h)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.chipTexto, hospital === h && styles.chipTextoSelecionado]}>
                          {h}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {hospital === "Outro hospital" && (
                    <View style={[globalStyles.inputWrapper, { marginTop: SPACING.sm }]}>
                      <MaterialIcons name="local-hospital" size={20} color={COLORS.coolSteel} style={globalStyles.inputIcon} />
                      <TextInput
                        style={globalStyles.input}
                        placeholder="Nome do hospital *"
                        placeholderTextColor={COLORS.coolSteel}
                        value={outroHospital}
                        onChangeText={setOutroHospital}
                        autoCapitalize="words"
                      />
                    </View>
                  )}
                </View>
              )}

              {/* ── Ponto de Embarque ── */}
              <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>Ponto de embarque *</Text>
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="location-on" size={20} color={COLORS.coolSteel} style={globalStyles.inputIcon} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Rua, número ou referência"
                    placeholderTextColor={COLORS.coolSteel}
                    value={pontoEmbarque}
                    onChangeText={setPontoEmbarque}
                    autoCapitalize="sentences"
                  />
                </View>
              </View>

              {/* ── Botão ── */}
              <TouchableOpacity
                style={[globalStyles.buttonPrimary, loading && { opacity: 0.7 }]}
                onPress={handleSolicitar}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.inkBlack} />
                ) : (
                  <Text style={globalStyles.buttonPrimaryText}>Solicitar Transporte</Text>
                )}
              </TouchableOpacity>
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
    alignSelf: "flex-start",
  },
  headerTitle: {
    fontSize: FONTS.size2XL,
    fontWeight: FONTS.weightBold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONTS.sizeMD,
    color: COLORS.coolSteel,
  },
  secao: {
    marginBottom: SPACING.lg,
  },
  secaoTitulo: {
    fontSize: FONTS.sizeXS,
    fontWeight: FONTS.weightBold,
    color: COLORS.coolSteel,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  cardRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  veiculoCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 2,
    borderColor: "transparent",
    gap: 4,
  },
  horarioCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 2,
    borderColor: "transparent",
    gap: 4,
  },
  cardSelecionado: {
    borderColor: COLORS.accent,
    backgroundColor: "rgba(79,209,197,0.12)",
  },
  cardCheio: {
    opacity: 0.4,
  },
  cardNome: {
    color: COLORS.coolSteel,
    fontSize: FONTS.sizeMD,
    fontWeight: FONTS.weightBold,
  },
  cardNomeSelecionado: {
    color: COLORS.accent,
  },
  cardInfo: {
    color: COLORS.coolSteel,
    fontSize: FONTS.sizeXS,
  },
  horarioHora: {
    color: COLORS.white,
    fontSize: FONTS.sizeLG,
    fontWeight: FONTS.weightBold,
  },
  chipLista: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  chipSelecionado: {
    borderColor: COLORS.accent,
    backgroundColor: "rgba(79,209,197,0.12)",
  },
  chipTexto: {
    color: COLORS.coolSteel,
    fontSize: FONTS.sizeSM,
  },
  chipTextoSelecionado: {
    color: COLORS.accent,
    fontWeight: FONTS.weightBold,
  },
});
