import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Modal } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Músicas");
  const [favorites, setFavorites] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showQuote, setShowQuote] = useState(false);
  const scrollRef = useRef(null);
  const { width: screenWidth } = Dimensions.get('window');

  const carouselImages = [
    require("../../public/Banner - Inspire Daily.png"),
    require("../../public/Banner - Inspire Daily 2.png"),
    require("../../public/Banner - Inspire Daily 3.png"),
    require("../../public/Banner - Inspire Daily 4.png"),
  ];

  // Dias com frases especiais (simulação)
  const inspirationDays = [1, 5, 10, 15, 20, 25, 27]; // dias do mês com conteúdo especial

  // Frases para cada dia especial (versões curtas)
  const dailyQuotes = {
    1: {
      text: "Cada novo dia é uma nova oportunidade.",
      author: "Dalai Lama"
    },
    5: {
      text: "Sucesso é a soma de pequenos esforços diários.",
      author: "Robert Collier"
    },
    10: {
      text: "A vida é 10% o que acontece, 90% como reagimos.",
      author: "Charles R. Swindoll"
    },
    15: {
      text: "Agarre ocasiões comuns e as torne grandiosas.",
      author: "Orison Swett Marden"
    },
    20: {
      text: "O futuro pertence aos que acreditam em seus sonhos.",
      author: "Eleanor Roosevelt"
    },
    25: {
      text: "Ame o que você faz para fazer um excelente trabalho.",
      author: "Steve Jobs"
    },
    27: {
      text: "Nada como um dia após o outro dia.",
      author: "Racionais MC's"
    }
  };

  // Função para obter a frase do dia selecionado
  const getDayQuote = (day) => {
    return dailyQuotes[day] || {
      text: "Inspire-se todos os dias!",
      author: "Inspire Daily"
    };
  };

  // Função para tratar clique na data
  const handleDatePress = (date) => {
    setSelectedDate(date);
    // Mostra a frase apenas se a data tiver inspiração
    const hasInspiration = inspirationDays.includes(date.getDate()) && 
                          date.getMonth() === new Date().getMonth();
    setShowQuote(hasInspiration);
  };

  // Auto-scroll do carrossel
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

  // Função para gerar dias do mês
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

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
              style={styles.carouselScrollView}
              contentContainerStyle={styles.carouselContent}
              snapToInterval={screenWidth - 20}
              snapToAlignment="start"
              decelerationRate="fast"
            >
              {carouselImages.map((image, index) => (
                <View key={index} style={styles.carouselImageContainer}>
                  <Image source={image} style={styles.carouselImage} resizeMode="contain" />
                </View>
              ))}
            </ScrollView>
            
            {/* Indicadores */}
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
          {/* Título Frase do Dia */}
          <Text style={styles.sectionTitle}>Frase do Dia</Text>

          {/* Calendário e Frase do Dia */}
          <View style={styles.calendarMainContainer}>
            {/* Calendário */}
            <View style={styles.calendarContainer}>
              <Text style={styles.calendarTitle}>Calendário</Text>
              <Text style={styles.calendarSubtitle}>
                {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
              </Text>
              
              {/* Cabeçalho dos dias da semana */}
              <View style={styles.calendarHeader}>
                {dayNames.map((day) => (
                  <Text key={day} style={styles.dayHeader}>
                    {day}
                  </Text>
                ))}
              </View>
              
              {/* Grid do calendário */}
              <View style={styles.calendarGrid}>
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === new Date().getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  const hasInspiration = inspirationDays.includes(date.getDate()) && isCurrentMonth;
                  const isSelected = selectedDate.toDateString() === date.toDateString();
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.calendarDay,
                        isCurrentMonth && styles.currentMonth,
                        isToday && styles.today,
                        hasInspiration && styles.inspirationDay,
                        isSelected && styles.selectedDay,
                      ]}
                      onPress={() => handleDatePress(date)}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          !isCurrentMonth && styles.otherMonthText,
                          isToday && styles.todayText,
                          hasInspiration && styles.inspirationDayText,
                          isSelected && styles.selectedDayText,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                      {hasInspiration && (
                        <View style={styles.inspirationDot} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Frase do dia selecionado - ao lado direito */}
          </View>
        </View>

        {/* Modal da frase do dia */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showQuote}
          onRequestClose={() => setShowQuote(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowQuote(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
              
              <Text style={styles.modalTitle}>Frase do dia {selectedDate.getDate()}</Text>
              
              <Text style={styles.modalQuoteText}>
                "{getDayQuote(selectedDate.getDate()).text}"
              </Text>
              
              <Text style={styles.modalQuoteAuthor}>
                — {getDayQuote(selectedDate.getDate()).author}
              </Text>
            </View>
          </View>
        </Modal>
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#cf97e6ff",
    marginLeft: 20,
    marginBottom: 15,
    marginTop: 40,
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
    height: 180,
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
  // Estilos do calendário
  calendarMainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  calendarContainer: {
    width: 250,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  calendarSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    flex: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 2,
  },
  currentMonth: {
    // Estilo para dias do mês atual
  },
  today: {
    backgroundColor: '#cf97e6ff',
    borderRadius: 14,
  },
  inspirationDay: {
    backgroundColor: '#e8f4f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#87ceeb',
  },
  selectedDay: {
    backgroundColor: '#e8b7f5ff',
    borderRadius: 12,
  },
  calendarDayText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  otherMonthText: {
    color: '#ccc',
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inspirationDayText: {
    color: '#2c5aa0',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inspirationDot: {
    position: 'absolute',
    bottom: 2,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ff6b6b',
  },
  dayQuoteContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#cf97e6ff',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    width: '65%',
    alignSelf: 'flex-start',
  },
  dayQuoteText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'left',
  },
  dayQuoteAuthor: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right',
    fontWeight: '500',
    marginTop: 0,
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    color: '#cf97e6ff',
  },
  modalQuoteText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalQuoteAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});
