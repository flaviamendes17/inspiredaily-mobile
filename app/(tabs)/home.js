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

  const allQuotes = [
    {
      id: 1,
      text: "Mas lembre-se:\nAcontece o que aconteça\nNada como um dia após o outro dia",
      author: "Sou + Você",
      detail: "Racionais MC's",
      colors: ["#7799FC", "#B8A5F3"],
      category: "Músicas",
    },
    {
      id: 2,
      text: "A vida é como andar de bicicleta. Para manter o equilíbrio, você precisa continuar se movendo",
      author: "Albert Einstein",
      detail: "Físico",
      colors: ["#B8A5F3", "#E5B8F4"],
      category: "Citações",
    },
    {
      id: 3,
      text: "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo",
      author: "Winston Churchill",
      detail: "Estadista",
      colors: ["#9c9df5", "#CBABF1"],
      category: "Citações",
    },
    {
      id: 4,
      text: "A única maneira de fazer um excelente trabalho é amar o que você faz",
      author: "Steve Jobs",
      detail: "Empresário",
      colors: ["#FF6B6B", "#FF8E8E"],
      category: "Citações",
    },
    {
      id: 5,
      text: "Não é o mais forte que sobrevive, nem o mais inteligente, mas o que melhor se adapta às mudanças",
      author: "Charles Darwin",
      detail: "Naturalista",
      colors: ["#4ECDC4", "#44A08D"],
      category: "Livros",
    },
    {
      id: 6,
      text: "O futuro pertence àqueles que acreditam na beleza de seus sonhos",
      author: "Eleanor Roosevelt",
      detail: "Primeira-dama",
      colors: ["#F093FB", "#F5576C"],
      category: "Citações",
    },
    {
      id: 7,
      text: "Seja você mesmo; todas as outras pessoas já existem",
      author: "Oscar Wilde",
      detail: "Escritor",
      colors: ["#43E97B", "#38F9D7"],
      category: "Citações",
    },
    {
      id: 8,
      text: "A imaginação é mais importante que o conhecimento",
      author: "Albert Einstein",
      detail: "Físico",
      colors: ["#FA709A", "#FEE140"],
      category: "Filmes",
    },
    {
      id: 9,
      text: "Acredite em si mesmo e chegará um dia em que os outros não terão outra escolha senão acreditar com você",
      author: "Cynthia Kersey",
      detail: "Autora",
      colors: ["#667eea", "#764ba2"],
      category: "Citações",
    },
    {
      id: 10,
      text: "O que nos desafia é o que nos transforma",
      author: "Paulo Coelho",
      detail: "Escritor",
      colors: ["#ffecd2", "#fcb69f"],
      category: "Livros",
    },
  ];

  const filteredQuotes = selectedCategory === "Músicas" 
    ? allQuotes.filter(q => q.category === "Músicas")
    : allQuotes.filter(q => q.category === selectedCategory);
  
  
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quotesContainer}
            contentContainerStyle={styles.quotesContent}
          >
            {filteredQuotes.map((quote) => (
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
