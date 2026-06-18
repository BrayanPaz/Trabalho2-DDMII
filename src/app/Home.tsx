import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useHome } from '../hooks/useHome';
import { homeStyles } from '../styles/homeStyles';

export default function Home() {
  const router = useRouter();
  const {
    folders,
    modalVisible,
    setModalVisible,
    newFolderName,
    setNewFolderName,
    newFolderDesc,
    setNewFolderDesc,
    handleLogout,
    handleCreate,
    resetModal
  } = useHome();

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.title}>O Meu Espaço</Text>
        <TouchableOpacity style={homeStyles.logoutBtn} onPress={handleLogout}>
          <Text style={homeStyles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={folders}
        numColumns={3}
        keyExtractor={item => item.id}
        contentContainerStyle={homeStyles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={homeStyles.folderItem}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/Pasta', params: { id: item.id, name: item.name, desc: item.description } })}
          >
            <View style={homeStyles.folderIcon}>
              <Text style={homeStyles.folderEmoji}>📁</Text>
            </View>
            <Text style={homeStyles.folderName} numberOfLines={2}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={homeStyles.emptyContainer}>
            <Text style={homeStyles.emptyText}>Nenhuma pasta criada. Prima no + para começar!</Text>
          </View>
        }
      />

      <TouchableOpacity style={homeStyles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Text style={homeStyles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={homeStyles.modalBg}>
          <View style={homeStyles.modalContent}>
            <Text style={homeStyles.modalTitle}>Nova Pasta</Text>
            <Text style={homeStyles.modalSubtitle}>Organize os seus ficheiros facilmente.</Text>
            
            <TextInput 
              style={homeStyles.input} 
              placeholder="Nome (obrigatório)" 
              placeholderTextColor="#94a3b8"
              value={newFolderName} 
              onChangeText={setNewFolderName} 
            />
            <TextInput 
              style={[homeStyles.input, homeStyles.inputMultiline]} 
              placeholder="Descrição (opcional)" 
              placeholderTextColor="#94a3b8"
              value={newFolderDesc} 
              onChangeText={setNewFolderDesc} 
              multiline
            />
            <View style={homeStyles.modalRow}>
              <TouchableOpacity style={homeStyles.cancelBtn} onPress={resetModal}>
                <Text style={homeStyles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={homeStyles.saveBtn} onPress={handleCreate}>
                <Text style={homeStyles.saveText}>Criar Pasta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
