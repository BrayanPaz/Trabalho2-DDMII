import { useState } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useFolders } from './useFolders';

export const useHome = () => {
  const router = useRouter();
  const { folders, createFolder } = useFolders();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  
  // Novos estados para a data personalizada da pasta
  const [newFolderDate, setNewFolderDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/LogIn');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleCreate = async () => {
    // Passa a data selecionada para a função de criação
    const success = await createFolder(newFolderName, newFolderDesc, newFolderDate);
    if (success) {
      resetModal();
    }
  };

  const resetModal = () => {
    setModalVisible(false);
    setNewFolderName('');
    setNewFolderDesc('');
    setNewFolderDate(new Date()); // Reseta para a data atual
    setShowDatePicker(false);
  };

  return {
    folders,
    modalVisible,
    setModalVisible,
    newFolderName,
    setNewFolderName,
    newFolderDesc,
    setNewFolderDesc,
    newFolderDate,
    setNewFolderDate,
    showDatePicker,
    setShowDatePicker,
    handleLogout,
    handleCreate,
    resetModal
  };
};