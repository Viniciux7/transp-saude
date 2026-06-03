import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar,
  Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, fonts, spacing, globalStyles } from "../styles/global-styles";

export default function PatientsScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");

  const handleAddPatient = async () => {
    if (!name.trim() && !age.trim() && !contact.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
  };

  return <SafeAreaView style={{ flex: 1 }}></SafeAreaView>;
}

const styles = StyleSheet.create({
  
});
