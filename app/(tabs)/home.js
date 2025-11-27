import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Músicas");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef(null);
  const { width: screenWidth } = Dimensions.get('window');

  // Imagens do carrossel
  const carouselImages = [
    require("../../public/Banner - Inspire Daily.png"),
    require("../../public/Banner - Inspire Daily 2.png"),
    require("../../public/Banner - Inspire Daily 3.png"),
    require("../../public/Banner - Inspire Daily 4.png"),
  ];

  // Auto-scroll do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselImages.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            x: nextIndex * (screenWidth - 20), // largura da imagem + margin
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval);
  }, [carouselImages.length, screenWidth]);

  const handleCategoryPress = (category) => {
    if (category === "Todas as frases") {
      router.push("/(tabs)/feed");
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

          {/* Separador */}
          <View style={styles.separator} />

          {/* Carrossel de Imagens */}
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
            
            {/* Indicadores de posição */}
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
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  // Estilos do carrossel
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
