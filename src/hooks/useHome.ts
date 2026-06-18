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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/LogIn');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleCreate = async () => {
    const success = await createFolder(newFolderName, newFolderDesc);
    if (success) {
      setModalVisible(false);
      setNewFolderName('');
      setNewFolderDesc('');
    }
  };

  const resetModal = () => {
    setModalVisible(false);
    setNewFolderName('');
    setNewFolderDesc('');
  };

  return {
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
  };
};
