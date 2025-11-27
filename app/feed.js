import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function FeedScreen() {
  const { user } = useAuth();
  const router = useRouter();
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
    {
      id: 4,
      text: "A única maneira de fazer um excelente trabalho é amar o que você faz",
      author: "Steve Jobs",
      detail: "Empresário",
      colors: ["#FF6B6B", "#FF8E8E"],
    },
    {
      id: 5,
      text: "Não é o mais forte que sobrevive, nem o mais inteligente, mas o que melhor se adapta às mudanças",
      author: "Charles Darwin",
      detail: "Naturalista",
      colors: ["#4ECDC4", "#44A08D"],
    },
    {
      id: 6,
      text: "O futuro pertence àqueles que acreditam na beleza de seus sonhos",
      author: "Eleanor Roosevelt",
      detail: "Primeira-dama",
      colors: ["#F093FB", "#F5576C"],
    },
    {
      id: 7,
      text: "Seja você mesmo; todas as outras pessoas já existem",
      author: "Oscar Wilde",
      detail: "Escritor",
      colors: ["#43E97B", "#38F9D7"],
    },
    {
      id: 8,
      text: "A imaginação é mais importante que o conhecimento",
      author: "Albert Einstein",
      detail: "Físico",
      colors: ["#FA709A", "#FEE140"],
    },
    {
      id: 9,
      text: "Acredite em si mesmo e chegará um dia em que os outros não terão outra escolha senão acreditar com você",
      author: "Cynthia Kersey",
      detail: "Autora",
      colors: ["#667eea", "#764ba2"],
    },
    {
      id: 10,
      text: "O que nos desafia é o que nos transforma",
      author: "Paulo Coelho",
      detail: "Escritor",
      colors: ["#ffecd2", "#fcb69f"],
    },
  ];


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
            {quotes.map((quote) => (
              <TouchableOpacity
                key={quote.id}
                onPress={() => router.push(`/details?id=${quote.id}`)}
              >
                <LinearGradient
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



