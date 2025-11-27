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
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { saveNewUser } from "../../utils/storage";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  
  const router = useRouter();

  const validateName = (text) => {
    setName(text);
    setIsNameValid(text.trim().length >= 3);
  };

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);
    setIsEmailValid(emailRegex.test(text));
  };

  const validatePassword = (text) => {
    setPassword(text);
    
    let strength = 0;
    if (text.length >= 6) strength++;
    if (text.length >= 8) strength++;
    if (/[A-Z]/.test(text)) strength++;
    if (/[0-9]/.test(text)) strength++;
    if (/[^A-Za-z0-9]/.test(text)) strength++;
    
    setPasswordStrength(Math.min(strength, 3));
    
    // Verificar se as senhas coincidem
    setPasswordsMatch(text === confirmPassword && text.length > 0);
  };

  const validateConfirmPassword = (text) => {
    setConfirmPassword(text);
    setPasswordsMatch(password === text && text.length > 0);
  };

  const getPasswordStrengthText = () => {
    if (password.length === 0) return '';
    if (passwordStrength === 0) return 'Muito fraca';
    if (passwordStrength === 1) return 'Fraca';
    if (passwordStrength === 2) return 'Média';
    return 'Forte';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return '#EF4444';
    if (passwordStrength === 1) return '#F59E0B';
    if (passwordStrength === 2) return '#3B82F6';
    return '#10B981';
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos corretamente.');
      setSuccess(null);
      return;
    }

    if (!isNameValid) {
      setError('Nome deve ter pelo menos 3 caracteres.');
      setSuccess(null);
      return;
    }

    if (!isEmailValid) {
      setError('Email inválido.');
      setSuccess(null);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setSuccess(null);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setSuccess(null);
      return;
    }

    if (!acceptTerms) {
      setError('Você precisa aceitar os termos e condições.');
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      const result = await saveNewUser(newUser);

      if (!result.success) {
        setError(result.message || "Falha ao criar conta");
      } else {
        setSuccess('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 1500);
      }
    } catch (error) {
      setError("Falha ao criar conta");
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
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
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
                <Text style={styles.h1}>Crie sua Conta</Text>
                <Text style={styles.logAccount}>Comece sua jornada de inspiração hoje</Text>

                <View style={styles.form}>
                  {/* Campo Nome */}
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#9C9DF5"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nome completo"
                      placeholderTextColor="#A4A4A4"
                      value={name}
                      onChangeText={validateName}
                      autoCapitalize="words"
                      autoCorrect={false}
                      textContentType="name"
                      returnKeyType="next"
                      editable={!loading}
                      underlineColorAndroid="transparent"
                    />
                    {name.length > 0 && (
                      <View style={styles.validationIcon}>
                        <Ionicons
                          name={isNameValid ? "checkmark-circle" : "close-circle"}
                          size={20}
                          color={isNameValid ? "#10B981" : "#EF4444"}
                        />
                      </View>
                    )}
                  </View>

                  {/* Campo Email */}
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
                      onChangeText={validateEmail}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      returnKeyType="next"
                      editable={!loading}
                      underlineColorAndroid="transparent"
                    />
                    {email.length > 0 && (
                      <View style={styles.validationIcon}>
                        <Ionicons
                          name={isEmailValid ? "checkmark-circle" : "close-circle"}
                          size={20}
                          color={isEmailValid ? "#10B981" : "#EF4444"}
                        />
                      </View>
                    )}
                  </View>

                  {/* Campo Senha */}
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color="#9C9DF5"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Senha (mínimo 6 caracteres)"
                      placeholderTextColor="#A4A4A4"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={validatePassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="newPassword"
                      returnKeyType="next"
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

                  {/* Indicador de força da senha */}
                  {password.length > 0 && (
                    <View style={styles.passwordStrengthContainer}>
                      <View style={styles.passwordStrengthBars}>
                        {[1, 2, 3].map((level) => (
                          <View
                            key={level}
                            style={[
                              styles.passwordStrengthBar,
                              passwordStrength >= level && {
                                backgroundColor: getPasswordStrengthColor(),
                              },
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={[styles.passwordStrengthText, { color: getPasswordStrengthColor() }]}>
                        {getPasswordStrengthText()}
                      </Text>
                    </View>
                  )}

                  {/* Campo Confirmar Senha */}
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color="#9C9DF5"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirmar senha"
                      placeholderTextColor="#A4A4A4"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={validateConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="newPassword"
                      returnKeyType="done"
                      onSubmitEditing={handleRegister}
                      editable={!loading}
                      underlineColorAndroid="transparent"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.validationIcon}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                    {confirmPassword.length > 0 && (
                      <View style={styles.validationIcon2}>
                        <Ionicons
                          name={passwordsMatch ? "checkmark-circle" : "close-circle"}
                          size={20}
                          color={passwordsMatch ? "#10B981" : "#EF4444"}
                        />
                      </View>
                    )}
                  </View>

                  {error && <Text style={styles.error}>{error}</Text>}
                  {success && <Text style={styles.success}>{success}</Text>}

                  {/* Termos e Condições */}
                  <View style={styles.termsContainer}>
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => setAcceptTerms(!acceptTerms)}
                      activeOpacity={0.7}
                    >
                      {acceptTerms ? (
                        <Ionicons name="checkmark-circle" size={20} color="#7779FC" />
                      ) : (
                        <Ionicons name="ellipse-outline" size={20} color="#9C9DF5" />
                      )}
                    </TouchableOpacity>
                    <Text style={styles.termsText}>
                      Eu aceito os{' '}
                      <Text style={styles.termsLink}>Termos e Condições</Text>
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Criar Conta</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.textArea}>
                  <Text style={styles.p}>Já tem uma conta? </Text>
                  <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7} disabled={loading}>
                    <Text style={styles.span}>Entrar</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.icons}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 }}>
                    <View style={{ width: 70, height: 1, backgroundColor: "#CDCDCD" }}></View>
                    <Text style={{ color: '#CDCDCD', fontSize: 12 }}>Ou registre-se com</Text>
                    <View style={{ width: 70, height: 1, backgroundColor: "#CDCDCD" }}></View>
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
          </ScrollView>
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
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    minHeight: screenHeight,
  },
  top: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: screenHeight * 0.30,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logo: {
    width: Math.min(screenWidth * 0.35, 140),
    height: Math.min(screenWidth * 0.35, 140),
  },
  main: {
    backgroundColor: 'white',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 30,
    minHeight: screenHeight * 0.75,
    justifyContent: 'space-between',
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
  validationIcon2: {
    paddingLeft: 5,
  },
  passwordStrengthContainer: {
    width: Math.min(screenWidth - 60, 320),
    marginBottom: 12,
    marginTop: -8,
  },
  passwordStrengthBars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  passwordStrengthBar: {
    flex: 1,
    height: 3,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'right',
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Math.min(screenWidth - 60, 320),
    marginVertical: 12,
  },
  checkbox: {
    marginRight: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '400',
    flex: 1,
  },
  termsLink: {
    color: '#7779FC',
    fontWeight: '500',
    textDecorationLine: 'underline',
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
