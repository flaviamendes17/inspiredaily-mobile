import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";


export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Músicas");


  const categories = ["Todas as frases", "Músicas", "Filmes", "Séries", "Livros", "Citações"];
 
  const quotes = [
    {
      id: 1,
      text: "Mas lembre-se:\nAcontece o que aconteça\nNada como um dia após o outro dia",
      author: "Sou + Você",
      detail: "Racionais MC's",
      colors: ["#7799FC", "#B8A5F3"],
    },
    {
      id: 2,
      text: "A vida é como andar de bicicleta. Para manter o equilíbrio, você precisa continuar se movendo",
      author: "Albert Einstein",
      detail: "Físico",
      colors: ["#B8A5F3", "#E5B8F4"],
    },
    {
      id: 3,
      text: "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo",
      author: "Winston Churchill",
      detail: "Estadista",
      colors: ["#9c9df5", "#CBABF1"],
    },
  ];


  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Citações</Text>
         
          <Text style={styles.mainTitle}>Principais Frases</Text>
         
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
            {quotes.map((quote) => (
              <LinearGradient
                key={quote.id}
                colors={quote.colors}
                style={styles.quoteCard}
              >
                <Text style={styles.quoteIcon}>❝</Text>
                <Text style={styles.quoteText}>{quote.text}</Text>
                <Text style={styles.quoteIcon}>❞</Text>
                <View style={styles.quoteFooter}>
                  <Text style={styles.quoteAuthor}>{quote.author}</Text>
                  <Text style={styles.quoteDetail}>{quote.detail}</Text>
                </View>
              </LinearGradient>
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



