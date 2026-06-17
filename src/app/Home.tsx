import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useFolders } from '../hooks/useFolders';

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemSize = (screenWidth - 40) / numColumns;

export default function Home() {
  const router = useRouter();
  const { folders, createFolder } = useFolders();
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');

  const handleLogout = () => {
    signOut(auth).then(() => router.replace('/LogIn'));
  };

  const handleCreate = async () => {
    const success = await createFolder(newFolderName, newFolderDesc);
    if (success) {
      setModalVisible(false);
      setNewFolderName('');
      setNewFolderDesc('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Pastas</Text>
        <TouchableOpacity onPress={handleLogout}><Text style={styles.logoutText}>Sair</Text></TouchableOpacity>
      </View>

      <FlatList
        data={folders}
        numColumns={numColumns}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.folderItem}
            onPress={() => router.push({ pathname: '/Pasta', params: { id: item.id, name: item.name, desc: item.description } })}
          >
            <View style={styles.folderIcon} />
            <Text style={styles.folderName} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Pasta</Text>
            <TextInput style={styles.input} placeholder="Nome (obrigatório)" value={newFolderName} onChangeText={setNewFolderName} />
            <TextInput style={styles.input} placeholder="Descrição (opcional)" value={newFolderDesc} onChangeText={setNewFolderDesc} />
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleCreate}><Text style={styles.saveText}>Criar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold' },
  logoutText: { color: 'red', fontSize: 16 },
  list: { padding: 10 },
  folderItem: { width: itemSize, height: itemSize, padding: 5, alignItems: 'center', justifyContent: 'center' },
  folderIcon: { width: itemSize - 20, height: itemSize - 30, backgroundColor: '#ddd', borderRadius: 8 },
  folderName: { marginTop: 5, fontSize: 12, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#007bff', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 30 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20, marginTop: 10 },
  cancelText: { color: 'gray', fontSize: 16 },
  saveText: { color: '#007bff', fontSize: 16, fontWeight: 'bold' }
});
