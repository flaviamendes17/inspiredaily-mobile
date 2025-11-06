import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter, Link } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  
  const { signIn } = useAuth();
  const router = useRouter();

  const validateUsername = (text) => {
    const userRegex = /^[a-zA-Z0-9._]{3,}$/;
    setUsername(text);
    setIsUsernameValid(userRegex.test(text));
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos corretamente.');
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await signIn(email, password);

      if (!result.success) {
        setError(result.message || "Falha ao fazer login");
      } else {
        setSuccess('Login realizado com sucesso!');
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 100);
      }
    } catch (error) {
      setError("Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    try {
      router.back();
    } catch (error) {
      console.log('Erro na navegação:', error);
    }
  };

  const handleSignUpPress = () => {
    try {
      router.push('/(auth)/register');
    } catch (error) {
      console.log('Erro na navegação para SignUp:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/img/fundo-login.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={styles.contentContainer}>

            <View style={styles.top}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/img/logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

              <View style={styles.main}>
                <Text style={styles.h1}>Bem-vindo(a) de Volta!</Text>
                <Text style={styles.logAccount}>Acesse sua conta para continuar</Text>

                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <FontAwesome
                      name="envelope-o"
                      size={20}
                      color="#9C9DF5"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#A4A4A4"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      returnKeyType="next"
                      editable={!loading}
                      underlineColorAndroid="transparent"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color="#9C9DF5"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#A4A4A4"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="password"
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                      editable={!loading}
                      underlineColorAndroid="transparent"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.validationIcon}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>

                  {error && <Text style={styles.error}>{error}</Text>}
                  {success && <Text style={styles.success}>{success}</Text>}

                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => setRememberMe(!rememberMe)}
                      activeOpacity={0.7}
                    >
                      {rememberMe ? (
                        <Ionicons name="checkmark-circle" size={20} color="#7779FC" />
                      ) : (
                        <Ionicons name="ellipse-outline" size={20} color="#9C9DF5" />
                      )}
                    </TouchableOpacity>
                    <Text style={styles.label}>Lembrar-me</Text>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Entrar</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.textArea}>
                  <Text style={styles.p}>Não tem uma conta? </Text>
                  <TouchableOpacity onPress={handleSignUpPress} activeOpacity={0.7} disabled={loading}>
                    <Text style={styles.span}>Registre-se</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.icons}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 }}>
                    <View style={{ width: 90, height: 1, backgroundColor: "#CDCDCD" }}></View>
                    <Text style={{ color: '#CDCDCD' }}>Entrar com</Text>
                    <View style={{ width: 90, height: 1, backgroundColor: "#CDCDCD" }}></View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 15 }}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.socialButton}>
                      <Image 
                        source={require('../../assets/icons/iconGoogle.png')} 
                        style={{ width: 24, height: 24 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={styles.socialButton}>
                      <Ionicons name="logo-apple" size={25} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  top: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: screenHeight * 0.60,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logo: {
    width: Math.min(screenWidth * 0.5, 200),
    height: Math.min(screenWidth * 0.5, 200),
  },
  logoText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  inspireText: {
    fontSize: Platform.OS === 'ios' ? 38 : 42,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dailyText: {
    fontSize: Platform.OS === 'ios' ? 30 : 34,
    fontWeight: '500',
    color: 'white',
    marginTop: Platform.OS === 'ios' ? 4 : 7,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  main: {
    backgroundColor: 'white',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 30,
    minHeight: screenHeight * 0.55,
    justifyContent: 'space-between',
    height: '70%',
  },
  h1: {
    fontSize: Platform.OS === 'ios' ? 26 : 30,
    fontWeight: '600',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 8,
  },
  logAccount: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 30,
    marginBottom: 12,
    paddingHorizontal: 15,
    height: 50,
    width: Math.min(screenWidth - 60, 320),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 14,
    fontWeight: '400',
    color: '#2D2D2D',
    borderWidth: 0,
    outlineWidth: 0,
  },
  validationIcon: {
    paddingLeft: 10,
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  success: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Math.min(screenWidth - 60, 320),
    marginVertical: 12,
  },
  checkbox: {
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '400',
    flex: 1,
  },
  forgotPassword: {
    fontSize: 12,
    color: '#7779FC',
    fontWeight: '500',
  },
  button: {
    width: Math.min(screenWidth - 100, 240),
    height: 45,
    marginTop: 15,
    backgroundColor: '#7779FC',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7779FC',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  textArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    flexWrap: 'wrap',
  },
  p: {
    color: '#6B6B6B',
    fontWeight: '400',
    fontSize: 13,
  },
  span: {
    color: '#2D2D2D',
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  icons: {
    marginTop: 5,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
});
