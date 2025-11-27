import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState("");
  const [scale, setScale] = useState(1);
  const fullText = "Página Não Encontrada";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let direction = 1;
    const pulseInterval = setInterval(() => {
      setScale((prev) => {
        let newScale = prev + direction * 0.02;
        if (newScale >= 1.08) direction = -1;
        if (newScale <= 0.92) direction = 1;
        return newScale;
      });
    }, 80);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <LinearGradient
      colors={["#7799FC", "#9C9DF5", "#B8A5F3", "#C8ABF1"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <Text style={[styles.errorCode, { transform: [{ scale }] }]}>404</Text>
          </View>

          <Text style={styles.errorTitle}>{displayedText}</Text>

          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>
              "Nem todo caminho leva ao destino, mas todo erro nos ensina algo novo."
            </Text>
            <Text style={styles.quoteAuthor}>— Inspire Daily</Text>
          </View>

          <TouchableOpacity
            style={styles.buttonHome}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.buttonHomeText}>Voltar para Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => router.push("/feed")}
          >
            <Text style={styles.buttonSecondaryText}>Ver todas as frases</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  placeholder: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  topSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  errorCode: {
    fontSize: 150,
    fontWeight: "900",
    color: "rgba(255, 255, 255, 0.25)",
    letterSpacing: 4,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 32,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  quoteBox: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 32,
    borderLeftWidth: 3,
    borderLeftColor: "rgba(255, 255, 255, 0.4)",
    width: "50%",
  },
  quoteText: {
    fontSize: 20,
    color: "#FFFFFF",
    lineHeight: 23,
    fontWeight: "500",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    textAlign: "right",
    letterSpacing: 0.3,
  },
  buttonHome: {
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: "10%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonHomeText: {
    color: "#7799FC",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  buttonSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    width: "10%",
  },
  buttonSecondaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
