import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [frase, setFrase] = useState("");
  const [autor, setAutor] = useState("");
  const [artist, setArtist] = useState("");
  const [frases, setFrases] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [gradient, setGradient] = useState(["#6B8DD6", "#8E6DC6"]);
  const [usuarioId, setUsuarioId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);


  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          const id = await AsyncStorage.getItem("usuarioId");
          if (id) setUsuarioId(Number(id));
          else setUsuarioId(1);

          const savedImage = await AsyncStorage.getItem("profileImage");
          if (savedImage) {
            setProfileImage(savedImage);
          }
        } catch (err) {
          console.warn("Erro ao carregar dados:", err);
          setUsuarioId(1);
        }
      };

      loadData();
    }, [])
  );

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const validate = () => {
    if (!titulo || titulo.trim().length === 0) return "Título é obrigatório";
    if (!frase || frase.trim().length < 3) return "Frase muito curta";
    return null;
  };

  const createFrases = async () => {
    const err = validate();
    if (err) {
      Alert.alert("Erro", err);
      return;
    }

    setLoading(true);
    const payload = {
      frase,
      titulo,
      autor_frase: autor,
      categoria,
      curtidas_count: 0,
      usuario_id: usuarioId ? Number(usuarioId) : null,
      artist,
    };
    try {
      console.log("Enviando payload:", payload);
      const postRes = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/frases`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("POST sucesso:", postRes.data);

      // buscar lista de frases atualizada 
      const listRes = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/frases`);
      setFrases(listRes.data);
      console.log("Frases carregadas:", listRes.data.length);

      // limpar formulário e notificar sucesso
      setTitulo("");
      setFrase("");
      setAutor("");
      setArtist("");
      setCategoria("");
      Alert.alert("Sucesso", "Frase publicada com sucesso");
    } catch (error) {
      console.error("Erro ao publicar:", error);
      console.error("Status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      Alert.alert(
        "Erro ao publicar",
        error.response?.data?.message || JSON.stringify(error.response?.data) || error.message
      );
    } finally {
      setLoading(false);
    }
  }


  const gradientColors = [
    ["#6B8DD6", "#8E6DC6"],
    ["#7799FC", "#B8A5F3"],
    ["#B8A5F3", "#E5B8F4"],
    ["#9c9df5", "#CBABF1"],
    ["#FF6B6B", "#FF8E8E"],
    ["#4ECDC4", "#44A08D"],
    ["#F093FB", "#F5576C"],
    ["#43E97B", "#38F9D7"],
    ["#FA709A", "#FEE140"],
    ["#667eea", "#764ba2"],
    ["#ffecd2", "#fcb69f"],
    ["#a18cd1", "#fbc2eb"]
  ];

  return (
    <ScrollView style={styles.container}>
       <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
              >
                <Text style={styles.backButtonText}>← Voltar</Text>
              </TouchableOpacity>
            </View>

      <View style={styles.content}>
        {/* Header com perfil do usuário */}
        <LinearGradient
          colors={['#6B8DD6', '#8E6DC6']}
          style={styles.userHeader}
        >
          <View style={styles.userAvatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.userAvatar} />
            ) : (
              <Text style={styles.userAvatarText}>{getInitials(user?.name)}</Text>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userGreeting}>Olá, {user?.name?.split(" ")[0] || "Usuário"}! 👋</Text>
            <Text style={styles.userSubtext}>Pronto para inspirar alguém hoje?</Text>
          </View>
        </LinearGradient>

        <View style={styles.FormContainer}>
          <View style={styles.headerSection}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.title}>Crie uma nova frase</Text>
            <Text style={styles.subtitle}>
              Compartilhe sua inspiração com a comunidade
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📝 Título da publicação</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite um título chamativo..."
              placeholderTextColor="#9CA3AF"
              value={titulo}
              onChangeText={setTitulo}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>💭 Sua frase</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escreva sua frase inspiradora..."
              placeholderTextColor="#9CA3AF"
              value={frase}
              onChangeText={setFrase}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>✍️ Autor da frase</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do autor"
              placeholderTextColor="#9CA3AF"
              value={autor}
              onChangeText={setAutor}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🎤 Artista (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do artista ou criador"
              placeholderTextColor="#9CA3AF"
              value={artist}
              onChangeText={setArtist}
            />
          </View>

          <View style={styles.ChoseContainer}>
            <Text style={styles.sectionLabel}>Escolha um gradiente</Text>
            <View style={[styles.gradientOptions, { flexWrap: 'wrap' }]}>
              {gradientColors.map((pair, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setGradient(pair)}
                  style={[
                    styles.swatchWrapper,
                    gradient[0] === pair[0] && styles.swatchActive
                  ]}
                  activeOpacity={0.7}
                >
                  <LinearGradient colors={pair} style={styles.swatch} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🏷️ Categoria</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoria}
                onValueChange={setCategoria}
                style={styles.picker}
              >
                <Picker.Item label="Selecione uma categoria" value="" />
                <Picker.Item label="🎵 Músicas" value="Musicas" />
                <Picker.Item label="🎬 Filmes" value="Filmes" />
                <Picker.Item label="📺 Séries" value="Series" />
                <Picker.Item label="📚 Livros" value="Livros" />
                <Picker.Item label="✏️ Autorais" value="Autorais" />
                <Picker.Item label="🚀 Motivacionais" value="Motivacionais" />
                <Picker.Item label="💡 Reflexões" value="Reflexões" />
                <Picker.Item label="❤️ Amor" value="Amor" />
                <Picker.Item label="💪 Superação" value="Superação" />
                <Picker.Item label="☀️ Positividade" value="positividade" />
              </Picker>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonLoading]} 
            onPress={createFrases} 
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Publicar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>👀 Pré-visualização</Text>
            <Text style={styles.previewHint}>Veja como ficará sua publicação</Text>
            <LinearGradient colors={gradient} style={styles.previewCard}>
              <View style={styles.quoteIcon}>
                <Text style={styles.quoteSymbol}>"</Text>
              </View>
              <Text style={styles.quoteText}>
                {frase || "Sua frase inspiradora aparecerá aqui..."}
              </Text>
              {(autor || artist) && (
                <View style={styles.authorContainer}>
                  <View style={styles.authorDivider} />
                  <Text style={styles.metaText}>
                    {autor || "Autor"}{autor && artist ? " • " : ""}{artist || ""}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </View>


        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    marginBottom: 24,
    borderRadius: 24,
    shadowColor: "#8E6DC6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  userAvatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  userAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
  },
  userGreeting: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
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
    color: "#8E6DC6",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  FormContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 28,
    shadowColor: "#8E6DC6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 36,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
    letterSpacing: -1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    lineHeight: 22,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  input: {
    width: "100%",
    minHeight: 54,
    borderColor: "#E5E7EB",
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#FAFBFC",
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  ChoseContainer: {
    width: "100%",
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  gradientOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  swatchWrapper: {
    marginBottom: 12,
    borderRadius: 16,
    padding: 4,
    borderWidth: 3,
    borderColor: "transparent",
    backgroundColor: "#FFFFFF",
  },
  swatchActive: {
    borderColor: "#8E6DC6",
    shadowColor: "#8E6DC6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.05 }],
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: 13,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#FAFBFC",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  picker: {
    width: "100%",
    height: 54,
    fontSize: 16,
    color: "#111827",
    paddingLeft: 14,
  },
  button: {
    backgroundColor: "#8E6DC6",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 36,
    minHeight: 60,
    shadowColor: "#8E6DC6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonLoading: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  previewSection: {
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  previewHint: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  previewCard: {
    width: '100%',
    borderRadius: 24,
    padding: 36,
    marginBottom: 8,
    minHeight: 200,
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quoteIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    opacity: 0.3,
  },
  quoteSymbol: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 72,
  },
  quoteText: {
    fontSize: 20,
    fontWeight: "700",
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  authorContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  authorDivider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
    borderRadius: 1,
  },
  metaText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});