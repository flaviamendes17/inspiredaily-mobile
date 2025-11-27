import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Músicas");

  const handleCategoryPress = (category) => {
    if (category === "Todas as frases") {
      router.push("/feed");
    } else {
      setSelectedCategory(category);
    }
  };

  const categories = ["Todas as frases", "Músicas", "Filmes", "Séries", "Livros", "Citações"];
  
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Inspiração em doses diárias</Text>
          
          <View style={styles.headerContainer}>
            <Image 
              source={require("../../assets/logo-cerebro.png")} 
              style={styles.headerIcon}
            />
            <Text style={styles.mainTitle}>INSPIRE DAILY</Text>
          </View>
          
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
                onPress={() => handleCategoryPress(category)}
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginBottom: 20,
    gap: 12,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#cf97e6ff",
  },
  headerIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
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
    borderColor: "#e8b7f5ff",
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#e8b7f5ff",
  },
  categoryText: {
    fontSize: 14,
    color: "#e8b7f5ff",
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
  },
});
