import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

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
            const favoriteIds = JSON.parse(favData);
            setFavorites(favoriteIds);

            // Filtrar as frases curtidas
            const liked = allQuotes.filter(quote => favoriteIds.includes(quote.id));
            setLikedQuotes(liked);
          }
        } catch (error) {
          console.error("Erro ao carregar favoritos:", error);
        }
      };

      const loadProfileImage = async () => {
        try {
          const savedImage = await AsyncStorage.getItem("profileImage");
          if (savedImage) {
            setProfileImage(savedImage);
          }
        } catch (error) {
          console.error("Erro ao carregar foto de perfil:", error);
        }
      };

      loadFavorites();
      loadProfileImage();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const pickImage = async () => {
    // Solicitar permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de permissão para acessar suas fotos.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Abrir galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      
      // Salvar no AsyncStorage
      try {
        await AsyncStorage.setItem("profileImage", imageUri);
        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      } catch (error) {
        console.error("Erro ao salvar foto:", error);
        Alert.alert("Erro", "Não foi possível salvar a foto.");
      }
    }
  };

  const removeProfileImage = async () => {
    Alert.alert(
      "Remover foto",
      "Deseja remover sua foto de perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("profileImage");
              setProfileImage(null);
              Alert.alert("Sucesso", "Foto de perfil removida!");
            } catch (error) {
              console.error("Erro ao remover foto:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6B8DD6', '#8E6DC6']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            )}
          </View>
          
          {/* Botões de Edição da Foto */}
          <View style={styles.photoButtonsContainer}>
            <TouchableOpacity 
              style={styles.editPhotoButton} 
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
              <Text style={styles.editPhotoText}>
                {profileImage ? "Alterar foto" : "Adicionar foto"}
              </Text>
            </TouchableOpacity>
            
            {profileImage && (
              <TouchableOpacity 
                style={styles.removePhotoButton} 
                onPress={removeProfileImage}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.name}>{user?.name || "Usuário"}</Text>
          <Text style={styles.email}>{user?.email || "email@exemplo.com"}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da Conta</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={20} color="#8E6DC6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome Completo</Text>
                <Text style={styles.infoValue}>{user?.name || "Não informado"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail-outline" size={20} color="#8E6DC6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || "Não informado"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#8E6DC6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Membro desde</Text>
                <Text style={styles.infoValue}>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })
                    : "Data não disponível"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="finger-print-outline" size={20} color="#8E6DC6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>ID do Usuário</Text>
                <Text style={styles.infoValue}>#{user?.id || "000"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Posts Curtidos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Posts Curtidos</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{likedQuotes.length}</Text>
            </View>
          </View>

          {likedQuotes.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.likedPostsScroll}
              contentContainerStyle={styles.likedPostsContent}
            >
              {likedQuotes.map((quote) => (
                <TouchableOpacity
                  key={quote.id}
                  onPress={() => router.push(`/details?id=${quote.id}`)}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={quote.colors}
                    style={styles.likedPostCard}
                  >
                    <View style={styles.heartIconContainer}>
                      <Ionicons name="heart" size={16} color="#FFFFFF" />
                    </View>
                    <Text style={styles.likedPostText} numberOfLines={4}>
                      {quote.text}
                    </Text>
                    <View style={styles.likedPostFooter}>
                      <Text style={styles.likedPostAuthor} numberOfLines={1}>
                        {quote.author}
                      </Text>
                      {quote.detail && (
                        <Text style={styles.likedPostDetail} numberOfLines={1}>
                          {quote.detail}
                        </Text>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>
                Você ainda não curtiu nenhum post
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Explore o feed e curta suas frases favoritas
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push('/feed')}
              >
                <Text style={styles.exploreButtonText}>Explorar Frases</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusIconContainer}>
              <Ionicons name="checkmark-circle" size={32} color="#10B981" />
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusText}>Conta Ativa</Text>
              <Text style={styles.statusDescription}>
                Suas credenciais estão salvas com segurança
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={styles.logoutGradient}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Inspire Daily v2.0</Text>
          <Text style={styles.versionSubtext}>Expo Router + AsyncStorage</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  photoButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  editPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  editPhotoText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  removePhotoButton: {
    backgroundColor: "rgba(239, 68, 68, 0.8)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
    textAlign: "center",
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingLeft: 4,
  },
  countBadge: {
    backgroundColor: "#8E6DC6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "600",
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  statusIconContainer: {
    marginRight: 14,
  },
  statusContent: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 10,
  },
  versionText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "600",
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 11,
    color: "#D1D5DB",
  },
  likedPostsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  likedPostsContent: {
    paddingRight: 20,
  },
  likedPostCard: {
    width: 200,
    minHeight: 180,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  heartIconContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  likedPostText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 8,
  },
  likedPostFooter: {
    marginTop: "auto",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  likedPostAuthor: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 2,
  },
  likedPostDetail: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "center",
  },
  exploreButton: {
    backgroundColor: "#8E6DC6",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
