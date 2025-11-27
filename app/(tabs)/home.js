import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Músicas");
  const [favorites, setFavorites] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef(null);
  const { width: screenWidth } = Dimensions.get('window');

  const carouselImages = [
    require("../../public/Banner - Inspire Daily.png"),
    require("../../public/Banner - Inspire Daily 2.png"),
    require("../../public/Banner - Inspire Daily 3.png"),
    require("../../public/Banner - Inspire Daily 4.png"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselImages.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            x: nextIndex * (screenWidth - 20),
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselImages.length, screenWidth]);

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
    }, [])
  );

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

          <View style={styles.separator} />
          <View style={styles.carouselContainer}>
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x / (screenWidth - 20)
                );
                setCurrentImageIndex(newIndex);
              }}
              scrollEventThrottle={50}
              style={styles.carouselScrollView}
              contentContainerStyle={styles.carouselContent}
            >
              {carouselImages.map((image, index) => (
                <View key={index} style={styles.carouselImageContainer}>
                  <Image
                    source={image}
                    style={styles.carouselImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>
            

            <View style={styles.indicatorContainer}>
              {carouselImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    currentImageIndex === index && styles.indicatorActive,
                  ]}
                />
              ))}
            </View>
          </View>
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
                  {favorites.includes(quote.id) && (
                    <View style={styles.favoriteIcon}>
                      <Text>❤️</Text>
                    </View>
                  )}
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
    position: 'relative',
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
  favoriteIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  carouselContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  carouselScrollView: {
    paddingLeft: 20,
  },
  carouselContent: {
    paddingRight: 20,
  },
  carouselImageContainer: {
    width: Dimensions.get('window').width - 40,
    height: 250,
    overflow: 'hidden',
    marginRight: 20,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  indicatorActive: {
    backgroundColor: '#cf97e6ff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
