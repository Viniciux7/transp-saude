import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, fonts, spacing, globalStyles } from "../styles/global-styles";

export default function PatientsScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddPatient = async () => {
    // lógica de validação/cadastro aqui
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* sua UI aqui */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    
});