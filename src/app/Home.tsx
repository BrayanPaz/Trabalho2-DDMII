import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useHome } from '../hooks/useHome';
import { homeStyles } from '../styles/homeStyles';

const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

export default function Home() {
  const router = useRouter();
  const {
    folders, modalVisible, setModalVisible, newFolderName, setNewFolderName,
    newFolderDesc, setNewFolderDesc, newFolderDate, setNewFolderDate,
    showDatePicker, setShowDatePicker, handleLogout, handleCreate, resetModal
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
            onPress={() => router.push({ 
              pathname: '/Pasta', 
              params: { 
                id: item.id, 
                name: item.name, 
                desc: item.description,
                createdAt: item.createdAt?.toMillis ? item.createdAt.toMillis() : Date.now(),
                customDate: item.customDate?.toMillis ? item.customDate.toMillis() : Date.now()
              } 
            })}
          >
            <View style={homeStyles.folderIcon}>
              <Text style={homeStyles.folderEmoji}>📁</Text>
            </View>
            <Text style={homeStyles.folderName} numberOfLines={2}>{item.name}</Text>
            
            <View style={homeStyles.dateRow}>
              <Text style={homeStyles.dateGray} adjustsFontSizeToFit minimumFontScale={0.5} numberOfLines={1}>
                {formatTimestamp(item.createdAt)}
              </Text>
              <Text style={homeStyles.dateVibrant} adjustsFontSizeToFit minimumFontScale={0.5} numberOfLines={1}>
                {formatTimestamp(item.customDate)}
              </Text>
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
            
            <TextInput style={homeStyles.input} placeholder="Nome (obrigatório)" placeholderTextColor="#94a3b8" value={newFolderName} onChangeText={setNewFolderName} />
            <TextInput style={[homeStyles.input, homeStyles.inputMultiline]} placeholder="Descrição (opcional)" placeholderTextColor="#94a3b8" value={newFolderDesc} onChangeText={setNewFolderDesc} multiline />
            
            <TouchableOpacity style={homeStyles.datePickerBtn} onPress={() => setShowDatePicker(true)}>
              <Text style={homeStyles.datePickerText}>Data: {newFolderDate.toLocaleDateString('pt-BR')}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={newFolderDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setNewFolderDate(date);
                }}
              />
            )}

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