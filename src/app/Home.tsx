import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { useRouter } from 'expo-router';

export default function Home() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'galleries'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGalleries(data);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/LogIn');
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.galleryCard} 
      onPress={() => router.push(`/gallery/${item.id}`)}
      onLongPress={() => router.push(`/EditGallery?id=${item.id}`)} // Atalho para editar
    >
      <View style={styles.folderIcon}>
        <Text style={styles.folderText}>📁</Text>
      </View>
      <Text style={styles.galleryName} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Pastas</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={galleries}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma pasta criada ainda.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/CreateGallery')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#111827' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#a855f7' },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
  listContent: { padding: 10 },
  galleryCard: { flex: 1, aspectRatio: 1, backgroundColor: '#1f2937', margin: 6, borderRadius: 12, padding: 8, alignItems: 'center', justifyContent: 'center' },
  folderIcon: { width: 50, height: 50, backgroundColor: '#374151', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  folderText: { fontSize: 24 },
  galleryName: { color: '#fff', fontSize: 14, textAlign: 'center', fontWeight: '500' },
  emptyText: { color: '#9ca3af', textAlign: 'center', marginTop: 40 },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#9333ea', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold', lineHeight: 34 }
});