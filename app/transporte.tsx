import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar,
  Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS, FONTS, SPACING, globalStyles } from "../styles/global-styles";

export default function TransportScreen() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hospital, setHospital] = useState("");
  const [seats, setSeats] = useState("");

  const handleAddTransport = async () => {
      if (!date.trim() && !time.trim() && !hospital.trim() && !seats.trim()) {
        Alert.alert('Atenção', 'Preencha todos os campos.');
        return;
      }
    };

  return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
        <LinearGradient colors={[COLORS.primary, COLORS.bgDark]} start={{ x: 0, y: 0 }}
         end={{ x: 0, y: 1 }} style={{ flex: 1 }} ></LinearGradient>
        <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}
         behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
           
        </KeyboardAvoidingView>
        <ScrollView contentContainerStyle={{}}
         keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}
           style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
              <Text style={styles.headerTitle}>Entrar</Text>
              <Text style={styles.headerSubtitle}>
                Acesse sua conta para solicitar transporte
              </Text>
            </View>
            <View style={styles.form}>
            <View style={globalStyles.inputWrapper}>
                                    
            </View>
          </View>
        </ScrollView>
        <View>
          <FontAwesome6 name="calendar-alt" size={24} color="black" />
          <MaterialIcons name="access-time" size={24} color="black" />
          <MaterialIcons name="local-hospital" size={24} color="black" />
          <MaterialIcons name="event-seat" size={24} color="black" />
          <MaterialIcons name="directions-bus" size={24} color="black" />
        </View>
      </SafeAreaView>
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
    justifyContent: 'center',
  },

  linkBold: {
    color: COLORS.accent,
    fontWeight: FONTS.weightBold,
  }
});