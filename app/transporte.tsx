import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar,
  Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, fonts, spacing, globalStyles } from "../styles/global-styles";

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
    <SafeAreaView style={{ flex: 1 }}>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    
});