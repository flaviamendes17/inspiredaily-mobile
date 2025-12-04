import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function FeedScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Todas as frases");
  const [favorites, setFavorites] = useState([]);
  const [frases, setFrases] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "Todas as frases", 
    "Musicas", 
    "Filmes", 
    "Series", 
    "Livros", 
    "Autorais",
    "Motivacionais",
    "Reflexões",
    "Amor",
    "Superação",
    "positividade"
  ];

  const gradientColors = [
    ["#7799FC", "#B8A5F3"],
    ["#B8A5F3", "#E5B8F4"],
    ["#9c9df5", "#CBABF1"],
    ["#FF6B6B", "#FF8E8E"],
    ["#4ECDC4", "#44A08D"],
    ["#F093FB", "#F5576C"],
    ["#43E97B", "#38F9D7"],
    ["#FA709A", "#FEE140"],
    ["#667eea", "#764ba2"],
    ["#ffecd2", "#fcb69f"],
  ];

  const getAllFrases = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/frases`);
      
      const frasesWithColors = response.data.map((frase, index) => ({
        ...frase,
        colors: gradientColors[index % gradientColors.length]
      }));
      
      setFrases(frasesWithColors);
      console.log("Frases carregadas:", frasesWithColors.length);
    } catch (error) {
      console.error("Erro ao carregar frases:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        try {
          const favData = await AsyncStorage.getItem("favorites");
          if (favData) {
            setFavorites(JSON.parse(favData));
          }
        } catch (error) {
          console.error("Erro ao carregar favoritos:", error);
        }
      };

      loadFavorites();
      getAllFrases();
    }, [])
  );

  const filteredQuotes = selectedCategory === "Todas as frases" 
    ? frases 
    : frases.filter(frase => frase.categoria === selectedCategory);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Carregando frases...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Citações</Text>
         
          <Text style={styles.mainTitle}>Todas as Frases</Text>
         
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quotesContainer}
            contentContainerStyle={styles.quotesContent}
          >
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((frase) => (
                <TouchableOpacity
                  key={frase.id}
                  onPress={() => router.push(`/details?id=${frase.id}`)}
                >
                  <LinearGradient
                    colors={frase.colors}
                    style={styles.quoteCard}
                  >
                    {favorites.includes(frase.id) && (
                      <View style={styles.favoriteIcon}>
                        <Text>❤️</Text>
                      </View>
                    )}
                    <Text style={styles.quoteIcon}>❝</Text>
                    <Text style={styles.quoteText}>{frase.frase}</Text>
                    <Text style={styles.quoteIcon}>❞</Text>
                    <View style={styles.quoteFooter}>
                      <Text style={styles.quoteAuthor}>{frase.autor_frase}</Text>
                      <Text style={styles.quoteDetail}>{frase.titulo}</Text>
                      <Text style={styles.categoryBadge}>{frase.categoria}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma frase encontrada nesta categoria</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#666",
    marginLeft: 20,
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 20,
    marginBottom: 20,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#7799FC",
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#7799FC",
  },
  categoryText: {
    fontSize: 14,
    color: "#7799FC",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  quotesContainer: {
    marginTop: 10,
  },
  quotesContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  quoteCard: {
    width: 280,
    minHeight: 380,
    borderRadius: 20,
    padding: 25,
    marginRight: 15,
    justifyContent: "space-between",
    position: "relative",
  },
  favoriteIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    fontSize: 20,
  },
  quoteIcon: {
    fontSize: 40,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  quoteText: {
    fontSize: 18,
    color: "#FFFFFF",
    lineHeight: 28,
    fontWeight: "500",
    flex: 1,
    marginVertical: 20,
  },
  quoteFooter: {
    marginTop: 20,
  },
  quoteAuthor: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 4,
  },
  quoteDetail: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 4,
  },
  categoryBadge: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: 'center',
  },
});



