import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SPACING, globalStyles } from "../styles/global-styles";

export default function TransportScreen() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hospital, setHospital] = useState("");
  const [seats, setSeats] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddTransport = async () => {
    if (!date.trim() || !time.trim() || !hospital.trim() || !seats.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
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
              contentContainerStyle={{}}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cadastrar transporte</Text>
              </View>
              <View style={styles.form}>
                <View style={globalStyles.inputWrapper}>
                  <FontAwesome6 name="calendar-alt" size={24} color="black" />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Data"
                    placeholderTextColor={COLORS.coolSteel}
                    value={date}
                    onChangeText={setDate}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="access-time" size={24} color="black" />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Hora"
                    placeholderTextColor={COLORS.coolSteel}
                    value={time}
                    onChangeText={setTime}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={globalStyles.inputWrapper}>
                  <MaterialIcons name="local-hospital" size={24} color="black" />
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Endereço do hospital"
                    placeholderTextColor={COLORS.coolSteel}
                    value={hospital}
                    onChangeText={setHospital}
                    keyboardType="default"
                  />
                </View>
                <View style={globalStyles.inputWrapper}></View>
                <MaterialIcons name="event-seat" size={24} color="black" />
                <TextInput
                  style={globalStyles.input}
                  placeholder="Assentos disponíveis"
                  placeholderTextColor={COLORS.coolSteel}
                  value={seats}
                  onChangeText={setSeats}
                  keyboardType="numeric"
                />
              </View>
              <View style={globalStyles.inputWrapper}>
                <MaterialIcons name="directions-bus" size={24} color="black" />
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

  form: {
    flex: 1,
    justifyContent: "center",
  },

  linkBold: {
    color: COLORS.accent,
    fontWeight: FONTS.weightBold,
  },

  notesInput: {
    padding: 8,
    borderRadius: 10,
    borderColor: COLORS.oxfordNavy,
  },
});
