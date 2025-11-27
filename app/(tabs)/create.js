import React from "react";
import { useState, useEffect, } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,

} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function CreateScreen() {

  const [titulo, setTitulo] = useState("");
  const [frase, setFrase] = useState("");
  const [autor, setAutor] = useState("");
  const [artist, setArtist] = useState("");
  const [categoria, setCategoria] = useState("");
  const [gradient, setGradient] = useState(["#6B8DD6", "#8E6DC6"]);
  const [usuarioId, setUsuarioId] = useState(1);

  const handleCreate = async () => {
    if (!titulo || !frase || !autor || !categoria) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://10.88.199.159:3000/api/frases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frase,
          titulo,
          autor_frase: autor,
          categoria,
          curtidas_count: 0,
          usuario_id: Number(usuarioId),
        }),
      });

      const data = await response.json();
      console.log(data);
      Alert.alert("Sucesso", "Frase criada com sucesso!");
      setTitulo("");
      setFrase("");
      setAutor("");
      setCategoria("");
      setArtist("");
    } catch (error) {
      console.error("Erro ao enviar frase:", error);
      Alert.alert("Erro", "Não foi possível criar a frase.");
    }
  };

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
          <View style={styles.gradientOptions}>
            <TouchableOpacity onPress={() => setGradient(['#6B8DD6', '#8E6DC6'])} style={styles.swatchWrapper}>
              <LinearGradient colors={['#6B8DD6', '#8E6DC6']} style={styles.swatch} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGradient(['#a18cd1', '#fbc2eb'])} style={styles.swatchWrapper}>
              <LinearGradient colors={['#a18cd1', '#fbc2eb']} style={styles.swatch} />
            </TouchableOpacity>
          </View>
        </View>

        <Picker
          selectedValue={categoria}
          onValueChange={setCategoria}
          style={{ width: "100%", marginBottom: 20 }}
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

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Publicar</Text>
        </TouchableOpacity>

        <Text style={[styles.subtitle, { marginTop: 20 }]}>Preview</Text>
        <LinearGradient colors={gradient} style={styles.previewCard}>
          <Text style={styles.quoteText}>{frase || 'Sua frase aparecerá aqui'}</Text>
          <Text style={styles.metaText}>{autor || ''}{autor && artist ? ' — ' : ''}{artist || ''}</Text>
        </LinearGradient>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#8E6DC6",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#f0ebf5",
  },

  FormContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },

  ChoseContainer: { 
    width: "100%",
    marginBottom: 12,
  },


  emoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 24,
  },
  
  gradientOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swatchWrapper: {
    marginRight: 8,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  previewCard: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
  },
  quoteText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#E9ECEF",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
    fontStyle: "italic",
  },
});