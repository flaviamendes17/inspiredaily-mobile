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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";

export default function CreateScreen() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [frase, setFrase] = useState("");
  const [autor, setAutor] = useState("");
  const [artist, setArtist] = useState("");
  const [frases, setFrases] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [gradient, setGradient] = useState(["#6B8DD6", "#8E6DC6"]);
  const [usuarioId, setUsuarioId] = useState(1);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    (async () => {
      try {
        const id = await AsyncStorage.getItem("usuarioId");
        if (id) setUsuarioId(Number(id));
        else setUsuarioId(1); // fallback se quiser
      } catch (err) {
        console.warn("Erro ao ler usuarioId:", err);
        setUsuarioId(1);
      }
    })();
  }, []);

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
      <View style={styles.content}>
        <View style={styles.FormContainer}>
          <Text style={styles.title}>Crie uma nova frase!</Text>
          <Text style={styles.subtitle}>
            Preencha as informações abaixo
          </Text>

          <Text style={styles.label}>Título da publicação</Text>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={titulo}
            onChangeText={setTitulo}
          />

          <TextInput
            style={styles.input}
            placeholder="Frase"
            value={frase}
            onChangeText={setFrase}
            multiline
          />

          <Text style={styles.label}>Autor da frase</Text>
          <TextInput
            style={styles.input}
            placeholder="Autor da frase"
            value={autor}
            onChangeText={setAutor}
          />

          <Text style={styles.label}>Artista (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Artista (opcional)"
            value={artist}
            onChangeText={setArtist}
          />

          <View style={styles.ChoseContainer}>
            <Text style={{ marginBottom: 6, color: '#666' }}>Escolha um gradiente:</Text>
            <View style={[styles.gradientOptions, { flexWrap: 'wrap' }]}>
              {gradientColors.map((pair, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setGradient(pair)}
                  style={styles.swatchWrapper}
                >
                  <LinearGradient colors={pair} style={styles.swatch} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoria}
              onValueChange={setCategoria}
              style={styles.picker}
            >
              <Picker.Item label="Músicas" value="Musicas" />
              <Picker.Item label="Filmes" value="Filmes" />
              <Picker.Item label="Séries" value="Series" />
              <Picker.Item label="Livros" value="Livros" />
              <Picker.Item label="Autorais" value="Autorais" />
              <Picker.Item label="Motivacionais" value="Motivacionais" />
              <Picker.Item label="Reflexões" value="Reflexões" />
              <Picker.Item label="Amor" value="Amor" />
              <Picker.Item label="Superação" value="Superação" />
              <Picker.Item label="Positividade" value="positividade" />
            </Picker>
          </View>
          <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={createFrases} disabled={loading}>
            {loading ? <ActivityIndicator color="#" /> : <Text style={styles.buttonText}>Publicar</Text>}
          </TouchableOpacity>

          <Text style={[styles.subtitle, { marginTop: 20 }]}>Preview</Text>
          <LinearGradient colors={gradient} style={styles.previewCard}>
            <Text style={styles.quoteText}>{frase || "Sua frase aparecerá aqui"}</Text>
            <Text style={styles.metaText}>
              {autor || ""}{autor && artist ? " — " : ""}{artist || ""}
            </Text>
          </LinearGradient>


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
    paddingTop: 60,
    paddingBottom: 40,
  },
  FormContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#8E6DC6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#8E6DC6",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    width: "100%",
    minHeight: 50,
    borderColor: "#E5E7EB",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
    fontSize: 15,
    color: "#1F2937",
  },
  ChoseContainer: {
    width: "100%",
    marginBottom: 16,
    marginTop: 8,
  },
  gradientOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  swatchWrapper: {
    marginBottom: 8,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",

    marginBottom: 20,
    overflow: "hidden",

    shadowColor: "#8E6DC6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  picker: {
    width: "100%",
    height: 50,
    fontSize: 15,
    color: "#1F2937",

    paddingLeft: 12,
  },
  button: {
    backgroundColor: "#8E6DC6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#8E6DC6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  previewCard: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    marginBottom: 8,
    minHeight: 120,
    justifyContent: 'center',
    shadowColor: "#8E6DC6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  quoteText: {
    fontSize: 17,
    fontWeight: "500",
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 26,
  },
  metaText: {
    fontSize: 13,
    color: '#F3F4F6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});