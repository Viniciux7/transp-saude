import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { COLORS, FONTS, SPACING, globalStyles } from "../styles/global-styles";

export default function PatientsScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [date, setDate] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddPatient = async () => {
    if (!name.trim() || !age.trim() || !contact.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    // TODO: chamar pacienteController para salvar no Firebase
    // setLoading(true);
    // const resultado = await adicionarPaciente({ name, age, date, contact, notes });
    // setLoading(false);
    // if (!resultado.sucesso) { Alert.alert("Erro", resultado.erro); return; }
    // router.back();
  };

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
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cadastrar paciente</Text>
                <Text style={styles.headerSubtitle}>
                  Preencha os dados do paciente
                </Text>
              </View>

              <View style={styles.form}>
                {/* Nome */}
                <View style={globalStyles.inputWrapper}>
                  <FontAwesome6 name="person" size={20} color={COLORS.coolSteel} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Nome completo *"
                    placeholderTextColor={COLORS.coolSteel}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>

                {/* Idade */}
                <View style={globalStyles.inputWrapper}>
                  <FontAwesome6 name="id-badge" size={20} color={COLORS.coolSteel} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Idade *"
                    placeholderTextColor={COLORS.coolSteel}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                  />
                </View>

                <View style={globalStyles.inputWrapper}>
                  <FontAwesome6 name="calendar-alt" size={20} color={COLORS.coolSteel} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Data de nascimento (DD/MM/AAAA)"
                    placeholderTextColor={COLORS.coolSteel}
                    value={date}
                    onChangeText={setDate}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>

                {/* Contato */}
                <View style={globalStyles.inputWrapper}>
                  <FontAwesome6 name="phone-flip" size={20} color={COLORS.coolSteel} />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Contato *"
                    placeholderTextColor={COLORS.coolSteel}
                    value={contact}
                    onChangeText={setContact}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Observações */}
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="health-and-safety" size={20} color={COLORS.coolSteel} />
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Observações"
                    placeholderTextColor={COLORS.coolSteel}
                    value={notes}
                    onChangeText={setNotes}
                    multiline={true}
                    numberOfLines={5}
                  />
                </View>

                {/* Botão salvar */}
                <TouchableOpacity
                  style={[globalStyles.buttonPrimary, loading && { opacity: 0.7 }]}
                  onPress={handleAddPatient}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.inkBlack} />
                  ) : (
                    <Text style={globalStyles.buttonPrimaryText}>Salvar paciente</Text>
                  )}
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
  // FIX 3: scrollContent agora é aplicado — padding correto na lista
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
  form: {
    flex: 1,
  },
  notesInput: {
    flex: 1,
    padding: 8,
    borderRadius: 10,
    color: COLORS.white,
    // borderColor removida — usar o inputWrapper do globalStyles para consistência
  },
});
