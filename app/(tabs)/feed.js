import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.65;

export default function FeedScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Músicas");
  const scrollX = useRef(new Animated.Value(0)).current;

  const contentData = {
    Músicas: [
      {
        id: 1,
        quote: "Mas lembre-se: Aconteça o que aconteça. Nada como um dia após o outro dia",
        author: "Sou + Você",
        artist: "Raciocínio MC's",
        gradient: ["#6B8DD6", "#8E6DC6"],
      },
      {
        id: 2,
        quote: "Quando da dá dá, quando não dá, não dá", 
        author: "Giovanna Caron",
        artist: "Neymar Jr.",
        gradient: ["#FF6B9D", "#C44569"],
      },
      {
        id: 3,
        quote: "Sem a música, a vida seria um erro",
        author: "Filosofia",
        artist: "Friedrich Nietzsche",
        gradient: ["#4FACFE", "#00F2FE"],
      },
    ],
    Filmes: [
      {
        id: 1,
        quote: "Que a força esteja com você",
        author: "Star Wars",
        artist: "George Lucas",
        gradient: ["#2E3192", "#1BFFFF"],
      },
      {
        id: 2,
        quote: "Até o infinito e além!",
        author: "Toy Story",
        artist: "Buzz Lightyear",
        gradient: ["#00C9FF", "#92FE9D"],
      },
    ],
    Séries: [
      {
        id: 1,
        quote: "Winter is coming",
        author: "Game of Thrones",
        artist: "HBO",
        gradient: ["#434343", "#000000"],
      },
      {
        id: 2,
        quote: "I am the one who knocks",
        author: "Breaking Bad",
        artist: "Walter White",
        gradient: ["#0F2027", "#203A43", "#2C5364"],
      },
    ],
    Livros: [
      {
        id: 1,
        quote: "Não se pode julgar um livro pela capa",
        author: "Sabedoria Popular",
        artist: "Anônimo",
        gradient: ["#8E2DE2", "#4A00E0"],
      },
      {
        id: 2,
        quote: "A leitura engrandece a alma",
        author: "Filosofia",
        artist: "Voltaire",
        gradient: ["#F857A6", "#FF5858"],
      },
    ],
  };

  const currentContent = contentData[selectedCategory] || [];

  const renderCard = ({ item, index }) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              background: `linear-gradient(135deg, ${item.gradient.join(", ")})`,
            },
          ]}
        >
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.cardContent}>
            <Text style={styles.quoteIcon}>"</Text>
            <Text style={styles.quoteText}>{item.quote}</Text>
            <View style={styles.authorContainer}>
              <Text style={styles.authorName}>{item.author}</Text>
              <Text style={styles.artistName}>{item.artist}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Principais Frases</Text>
      </View>

      <View style={styles.categoryContainer}>
        {["Músicas", "Filmes", "Séries", "Livros"].map((category) => (
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
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.swiperContainer}>
        <Animated.FlatList
          data={currentContent}
          renderItem={renderCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        />
      </View>

      <View style={styles.pagination}>
        {currentContent.map((_, index) => {
          const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#F3E5F5",
    borderWidth: 1,
    borderColor: "#E1BEE7",
    alignItems: "center",
  },
  categoryButtonActive: {
    backgroundColor: "#AB47BC",
    borderColor: "#AB47BC",
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#AB47BC",
  },
  categoryButtonTextActive: {
    color: "#FFFFFF",
  },
  swiperContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
  },
  cardContainer: {
    width: CARD_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH - 20,
    height: CARD_HEIGHT,
    borderRadius: 25,
    padding: 25,
    backgroundColor: "#6B8DD6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  favoriteButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  quoteIcon: {
    fontSize: 60,
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: "bold",
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "500",
    lineHeight: 32,
    marginBottom: 30,
  },
  authorContainer: {
    marginTop: "auto",
  },
  authorName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 5,
  },
  artistName: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "400",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    gap: 8,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#AB47BC",
  },
});