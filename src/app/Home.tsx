import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useHome } from '../hooks/useHome';
import { useFolders } from '../hooks/useFolders';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const { updateFolder } = useFolders();

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const openFolderDatePicker = (id: string) => {
    setActiveFolderId(id);
    setDatePickerVisible(true);
  };

  const onChangeDate = (_: any, selected?: Date) => {
    setDatePickerVisible(Platform.OS === 'ios');
    if (selected && activeFolderId) {
      const folder = folders.find(f => f.id === activeFolderId);
      if (folder) {
        updateFolder(activeFolderId, folder.name, folder.description, selected);
      }
    }
    setActiveFolderId(null);
  };

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
            <View style={homeStyles.folderDateRow}>
              <Text style={homeStyles.folderDateGray}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</Text>
              <TouchableOpacity onPress={() => openFolderDatePicker(item.id)}>
                <Text style={homeStyles.folderDateEditable}>{item.customDate ? new Date(item.customDate).toLocaleDateString() : 'Escolher data'}</Text>
              </TouchableOpacity>
            </View>
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

      {datePickerVisible && (
        <DateTimePicker
          value={(folders.find(f => f.id === activeFolderId)?.customDate) ? new Date(folders.find(f => f.id === activeFolderId)!.customDate) : (folders.find(f => f.id === activeFolderId)?.createdAt ? new Date(folders.find(f => f.id === activeFolderId)!.createdAt) : new Date())}
          mode="date"
          display="default"
          maximumDate={new Date(new Date().getFullYear() + 10, 11, 31)}
          onChange={onChangeDate}
        />
      )}
    </View>
  );
}
