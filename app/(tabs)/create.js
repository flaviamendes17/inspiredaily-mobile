import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function CreateScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title}>Criar Inspiração</Text>
        <Text style={styles.subtitle}>
          Compartilhe uma frase inspiradora com a comunidade
        </Text>
        
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Funcionalidade de criação será implementada em breve...
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 24,
  },
  placeholder: {
    backgroundColor: "#F8F9FA",
    padding: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#E9ECEF",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
    fontStyle: "italic",
  },
});