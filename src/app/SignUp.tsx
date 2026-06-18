import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { signupStyles } from '../styles/signupStyles';

export default function SignUp() {
  const router = useRouter();
  const { email, setEmail, password, setPassword, loading, handleSignUp } = useAuth();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={signupStyles.container}>
      <View style={signupStyles.card}>
        <Text style={signupStyles.title}>Criar Conta</Text>
        <Text style={signupStyles.subtitle}>Junte-se a nós para organizar os seus ficheiros</Text>
        
        <TextInput
          style={signupStyles.input}
          placeholder="E-mail"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={signupStyles.input}
          placeholder="Senha"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={signupStyles.button} onPress={handleSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={signupStyles.buttonText}>Cadastrar-se</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={signupStyles.linkContainer}>
          <Text style={signupStyles.linkText}>Já tem uma conta? <Text style={signupStyles.linkBold}>Faça Login</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
