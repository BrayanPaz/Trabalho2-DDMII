import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const router = useRouter();
  const segments = useSegments();

  // Ouve as mudanças de estado de autenticação do Firebase
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return subscriber; // Limpa o listener ao desmontar
  }, [initializing]);

  // Redireciona com base no estado de autenticação
  useEffect(() => {
    if (initializing) return;

    // Verifica se a tela atual pertence ao grupo de autenticação (Login ou Cadastro)
    const inAuthGroup = segments[0] === 'LogIn' || segments[0] === 'SignUp';

    if (!user && !inAuthGroup) {
      // Se não houver utilizador e estiver a tentar aceder a uma área protegida, vai para o Login
      router.replace('/LogIn');
    } else if (user && inAuthGroup) {
      // Se já houver utilizador e tentar aceder ao Login/Signup, vai para a Home
      router.replace('/Home');
    }
  }, [user, initializing, segments]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="LogIn" />
      <Stack.Screen name="SignUp" />
      <Stack.Screen name="Home" />
      <Stack.Screen name="Pasta" />
    </Stack>
  );
}
