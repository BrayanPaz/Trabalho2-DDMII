import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona automaticamente para o ecrã de LogIn.
  // O ficheiro _layout.tsx encarrega-se de o mandar para a Home caso já esteja autenticado.
  return <Redirect href="/LogIn" />;
}
