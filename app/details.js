import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const allQuotes = [
  {
    id: 1,
    text: "Mas lembre-se:\nAcontece o que aconteça\nNada como um dia após o outro dia",
    author: "Sou + Você",
    detail: "Racionais MC's",
    colors: ["#7799FC", "#B8A5F3"],
    category: "Músicas",
    fullDescription: "O tempo passa para todos. A vida é um ciclo contínuo onde cada dia traz novas oportunidades. Essa mensagem nos lembra a importância de seguir em frente, entendendo que tudo é temporário e que devemos aproveitar cada momento.",
  },
  {
    id: 2,
    text: "A vida é como andar de bicicleta. Para manter o equilíbrio, você precisa continuar se movendo",
    author: "Albert Einstein",
    detail: "Físico",
    colors: ["#B8A5F3", "#E5B8F4"],
    category: "Citações",
    fullDescription: "Esta metáfora brilhante nos ensina que a vida requer movimento constante. Assim como em uma bicicleta, quando paramos de nos mover em direção aos nossos objetivos, perdemos o equilíbrio e caímos. O progresso contínuo é essencial.",
  },
  {
    id: 3,
    text: "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo",
    author: "Winston Churchill",
    detail: "Estadista",
    colors: ["#9c9df5", "#CBABF1"],
    category: "Citações",
    fullDescription: "Churchill nos mostra que o fracasso não é o oposto do sucesso, mas parte do caminho para alcançá-lo. A verdadeira resiliência está em manter a esperança e a motivação mesmo diante dos obstáculos.",
  },
  {
    id: 4,
    text: "A única maneira de fazer um excelente trabalho é amar o que você faz",
    author: "Steve Jobs",
    detail: "Empresário",
    colors: ["#FF6B6B", "#FF8E8E"],
    category: "Citações",
    fullDescription: "Jobs nos lembra que a paixão é fundamental para a excelência. Quando amamos o que fazemos, o trabalho deixa de ser uma obrigação e se torna uma missão. Isso é o que diferencia o bom do extraordinário.",
  },
  {
    id: 5,
    text: "Não é o mais forte que sobrevive, nem o mais inteligente, mas o que melhor se adapta às mudanças",
    author: "Charles Darwin",
    detail: "Naturalista",
    colors: ["#4ECDC4", "#44A08D"],
    category: "Livros",
    fullDescription: "Adaptabilidade é a chave para a sobrevivência em um mundo em constante mudança. Não é sobre força ou inteligência, mas sobre a capacidade de aprender, evoluir e se reinventar conforme necessário.",
  },
  {
    id: 6,
    text: "O futuro pertence àqueles que acreditam na beleza de seus sonhos",
    author: "Eleanor Roosevelt",
    detail: "Primeira-dama",
    colors: ["#F093FB", "#F5576C"],
    category: "Citações",
    fullDescription: "Eleanor nos inspira a cultivar e acreditar em nossos sonhos. O futuro é construído por aqueles que ousam sonhar grande e têm coragem para perseguir suas visões, independentemente das circunstâncias.",
  },
  {
    id: 7,
    text: "Seja você mesmo; todas as outras pessoas já existem",
    author: "Oscar Wilde",
    detail: "Escritor",
    colors: ["#43E97B", "#38F9D7"],
    category: "Citações",
    fullDescription: "Uma verdade poderosa sobre autenticidade e identidade. Não há razão para tentar ser alguém que você não é. O mundo precisa do que você tem de único e especial para oferecer.",
  },
  {
    id: 8,
    text: "A imaginação é mais importante que o conhecimento",
    author: "Albert Einstein",
    detail: "Físico",
    colors: ["#FA709A", "#FEE140"],
    category: "Filmes",
    fullDescription: "Enquanto o conhecimento nos permite resolver problemas atuais, a imaginação nos abre portas para possibilidades infinitas. A criatividade e a visão prospectiva são essenciais para a inovação.",
  },
  {
    id: 9,
    text: "Acredite em si mesmo e chegará um dia em que os outros não terão outra escolha senão acreditar com você",
    author: "Cynthia Kersey",
    detail: "Autora",
    colors: ["#667eea", "#764ba2"],
    category: "Citações",
    fullDescription: "A confiança em si mesmo é contagiante. Quando você verdadeiramente acredita no seu potencial, essa energia se reflete em suas ações e inevitavelmente inspira os outros a acreditarem em você também.",
  },
  {
    id: 10,
    text: "O que nos desafia é o que nos transforma",
    author: "Paulo Coelho",
    detail: "Escritor",
    colors: ["#ffecd2", "#fcb69f"],
    category: "Livros",
    fullDescription: "Os desafios não são obstáculos, mas oportunidades de crescimento. É através das dificuldades que nos transformamos em versões melhores de nós mesmos. Abraçar os desafios é abraçar a transformação.",
  },
];

export default function DetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { id } = params;

  const quote = allQuotes.find((q) => q.id === parseInt(id));
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await AsyncStorage.getItem("favorites");
        if (favorites) {
          const favoriteIds = JSON.parse(favorites);
          setIsFavorite(favoriteIds.includes(parseInt(id)));
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      }
    };

    loadFavorites();
  }, [id]);

  const handleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      let favoriteIds = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favoriteIds = favoriteIds.filter((favId) => favId !== parseInt(id));
      } else {
        if (!favoriteIds.includes(parseInt(id))) {
          favoriteIds.push(parseInt(id));
        }
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favoriteIds));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error);
    }
  };

  const handleShare = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareLink = `${typeof window !== 'undefined' ? window.location.origin : 'localhost:8081'}/details?id=${id}`;
    
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareLink).then(() => {
        Alert.alert('Sucesso!', 'Link copiado para a área de transferência');
      }).catch(err => {
        Alert.alert('Erro', 'Não foi possível copiar o link');
      });
    } else {
      Alert.alert('Link para compartilhar', shareLink);
    }
  };

  if (!quote) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Citação não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <LinearGradient
            colors={quote.colors}
            style={styles.quoteCardLarge}
          >
            {isFavorite && (
              <View style={styles.favoriteIndicator}>
                <Text>❤️</Text>
              </View>
            )}
            <View style={styles.cardHeader}>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleFavorite}
              >
                <Text style={styles.favoriteIcon}>
                  {isFavorite ? "❤️" : "🤍"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.quoteIconLarge}>❝</Text>
            <Text style={styles.quoteTextLarge}>{quote.text}</Text>
            <Text style={styles.quoteIconLarge}>❞</Text>

            <View style={styles.quoteFooterLarge}>
              <Text style={styles.quoteAuthorLarge}>{quote.author}</Text>
              <Text style={styles.quoteDetailLarge}>{quote.detail}</Text>
            </View>
          </LinearGradient>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.buttonOutline}>
              <Text style={styles.buttonOutlineText}>{quote.detail}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonFilled} onPress={handleShare}>
              <Text style={styles.buttonFilledText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Citação de "{quote.author}"</Text>
            <Text style={styles.infoCategory}>{quote.detail}</Text>

            <View style={styles.divider} />

            <Text style={styles.descriptionTitle}>O tempo pode curar e trazer novas perspectivas para as dificuldades. Com o devido cuidado e reflexão, você tem a oportunidade de carregar se de novo e de forma mais inteligente do que antes, potencialmente aprendendo valiosas lições.</Text>

            <View style={styles.tagSection}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>#{quote.category}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#7799FC",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  placeholder: {
    width: 30,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  quoteCardLarge: {
    borderRadius: 24,
    padding: 28,
    minHeight: 420,
    justifyContent: "space-between",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: 20,
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  quoteIconLarge: {
    fontSize: 48,
    color: "#FFFFFF",
    opacity: 0.7,
    marginBottom: 8,
  },
  quoteTextLarge: {
    fontSize: 20,
    color: "#FFFFFF",
    lineHeight: 32,
    fontWeight: "600",
    marginVertical: 24,
    flex: 1,
  },
  quoteFooterLarge: {
    marginTop: 24,
  },
  quoteAuthorLarge: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 4,
  },
  quoteDetailLarge: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  buttonOutline: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#7799FC",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOutlineText: {
    color: "#7799FC",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonFilled: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#7799FC",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonFilledText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  infoCategory: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 16,
  },
  tagSection: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#E8EDFF",
  },
  tagText: {
    color: "#7799FC",
    fontSize: 12,
    fontWeight: "500",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#999",
  },
});
