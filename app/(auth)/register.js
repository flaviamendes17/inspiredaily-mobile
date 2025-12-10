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
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { saveNewUser } from "../../utils/storage";

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
  
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  
  const router = useRouter();

  const validateName = (text) => {
    setName(text);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (text) => {
    let strength = 0;
    if (text.length >= 6) strength++;
    if (text.length >= 8) strength++;
    if (/[A-Z]/.test(text)) strength++;
    if (/[0-9]/.test(text)) strength++;
    if (/[^A-Za-z0-9]/.test(text)) strength++;
    return Math.min(strength, 3);
  };

  const validatePassword = (text) => {
    setPassword(text);
  };

  const validateConfirmPassword = (text) => {
    setConfirmPassword(text);
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      setSuccess(null);
      return;
    }

    if (name.trim().length < 3) {
      setError('Nome deve ter pelo menos 3 caracteres.');
      setSuccess(null);
      return;
    }

    if (!validateEmail(email)) {
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
    router.back();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/img/fundo-login.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/img/logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.welcomeTitle}>Crie sua Conta</Text>
              <Text style={styles.welcomeSubtitle}>Comece sua jornada de inspiração hoje</Text>
            </View>

            <View style={styles.formSection}>
              <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Nome</Text>
                  <View style={[
                    styles.inputContainer,
                    nameFocused && styles.inputContainerFocused
                  ]}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={nameFocused ? "#6366F1" : "#9CA3AF"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Seu nome completo"
                      placeholderTextColor="#9CA3AF"
                      value={name}
                      onChangeText={validateName}
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                      autoCapitalize="words"
                      autoCorrect={false}
                      returnKeyType="next"
                    />
                    {name.length >= 3 && (
                      <View style={styles.validationIconContainer}>
                        <View style={styles.validationIconSuccess}>
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={[
                    styles.inputContainer,
                    emailFocused && styles.inputContainerFocused
                  ]}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={emailFocused ? "#6366F1" : "#9CA3AF"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="seuemail@exemplo.com"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      returnKeyType="next"
                    />
                    {email.length > 0 && (
                      <View style={styles.validationIconContainer}>
                        {validateEmail(email) ? (
                          <View style={styles.validationIconSuccess}>
                            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                          </View>
                        ) : (
                          <View style={styles.validationIconError}>
                            <Ionicons name="close" size={12} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Senha</Text>
                  <View style={[
                    styles.inputContainer,
                    passwordFocused && styles.inputContainerFocused
                  ]}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={passwordFocused ? "#6366F1" : "#9CA3AF"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={validatePassword}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="newPassword"
                      returnKeyType="next"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                    {password.length > 0 && (
                      <View style={styles.validationIconContainer}>
                        {password.length >= 6 ? (
                          <View style={styles.validationIconSuccess}>
                            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                          </View>
                        ) : (
                          <View style={styles.validationIconError}>
                            <Ionicons name="close" size={12} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  {password.length > 0 && password.length < 6 && (
                    <Text style={styles.inputHint}>Senha deve ter pelo menos 6 caracteres</Text>
                  )}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Confirmar Senha</Text>
                  <View style={[
                    styles.inputContainer,
                    confirmPasswordFocused && styles.inputContainerFocused
                  ]}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={confirmPasswordFocused ? "#6366F1" : "#9CA3AF"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Digite a senha novamente"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={validateConfirmPassword}
                      onFocus={() => setConfirmPasswordFocused(true)}
                      onBlur={() => setConfirmPasswordFocused(false)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="newPassword"
                      returnKeyType="done"
                      onSubmitEditing={handleRegister}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeIcon}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                    {confirmPassword.length > 0 && (
                      <View style={styles.validationIconContainer2}>
                        {password === confirmPassword ? (
                          <View style={styles.validationIconSuccess}>
                            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                          </View>
                        ) : (
                          <View style={styles.validationIconError}>
                            <Ionicons name="close" size={12} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <Text style={styles.inputHint}>As senhas não coincidem</Text>
                  )}
                </View>

                {error && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                {success && (
                  <View style={styles.successContainer}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.successText}>{success}</Text>
                  </View>
                )}

                <View style={styles.termsContainer}>
                  <TouchableOpacity
                    style={styles.termsCheckboxContainer}
                    onPress={() => setAcceptTerms(!acceptTerms)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                      {acceptTerms && (
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.termsText}>
                      Eu aceito os{' '}
                      <Text style={styles.termsLink}>Termos e Condições</Text>
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                  onPress={handleRegister}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#9CA3AF', '#9CA3AF'] : ['#6366F1', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.registerButtonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.registerButtonText}>Criar Conta</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>ou continue com</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialContainer}>
                  <TouchableOpacity 
                    activeOpacity={0.7} 
                    style={styles.socialButton}
                    disabled={loading}
                  >
                    <Image 
                      source={require('../../assets/icons/iconGoogle.png')} 
                      style={styles.socialIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    activeOpacity={0.7} 
                    style={styles.socialButton}
                    disabled={loading}
                  >
                    <Ionicons name="logo-apple" size={24} color="#000000" />
                  </TouchableOpacity>
                </View>

                <View style={styles.signInContainer}>
                  <Text style={styles.signInText}>Já tem uma conta? </Text>
                  <TouchableOpacity 
                    onPress={handleBackPress} 
                    activeOpacity={0.7} 
                    disabled={loading}
                  >
                    <Text style={styles.signInLink}>Entrar</Text>
                  </TouchableOpacity>
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
  },
  backgroundImage: {
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
  headerSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 12,
  },
  logo: {
    width: 90,
    height: 90,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputWrapper: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 52,
  },
  inputContainerFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#FFFFFF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  validationIconContainer: {
    marginLeft: 8,
  },
  validationIconContainer2: {
    marginLeft: 4,
  },
  validationIconSuccess: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  validationIconError: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#1F2937',
    paddingVertical: 0,
    outlineStyle: 'none',
  },
  inputHint: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
  },
  eyeIcon: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  successText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  termsContainer: {
    marginBottom: 16,
  },
  termsCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  termsText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '400',
    flex: 1,
  },
  termsLink: {
    color: '#6366F1',
    fontWeight: '600',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  registerButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    marginHorizontal: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  signInLink: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '700',
  },
});
