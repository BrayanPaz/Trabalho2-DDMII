import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { loginStyles } from '../styles/loginStyles';

export default function LogIn() {
  const router = useRouter();
  const { email, setEmail, password, setPassword, loading, handleLogin } = useAuth();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={loginStyles.container}>
      <View style={loginStyles.card}>
        <Text style={loginStyles.title}>Bem-vindo</Text>
        <Text style={loginStyles.subtitle}>Logue para continuar e usar sua galeria</Text>
        
        <TextInput
          style={loginStyles.input}
          placeholder="E-mail"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={loginStyles.input}
          placeholder="Senha"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={loginStyles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={loginStyles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/SignUp')} style={loginStyles.linkContainer}>
          <Text style={loginStyles.linkText}>Novo por aqui? <Text style={loginStyles.linkBold}>Crie uma conta</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
