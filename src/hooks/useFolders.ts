import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Alert } from 'react-native';

export interface Folder {
  id: string;
  name: string;
  description: string;
}

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'users', auth.currentUser.uid, 'folders'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Folder));
      setFolders(data);
    });
    return () => unsub();
  }, []);

  const createFolder = async (name: string, description: string) => {
    if (!auth.currentUser || !name.trim()) return false;
    
    // Verificação de nome único
    const exists = folders.some(f => f.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      Alert.alert('Erro', 'Já existe uma pasta com esse nome.');
      return false;
    }

    try {
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'folders'), {
        name,
        description,
        createdAt: new Date()
      });
      return true;
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível criar a pasta.');
      return false;
    }
  };

  const updateFolder = async (id: string, name: string, description: string) => {
    if (!auth.currentUser || !name.trim()) return;
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'folders', id), { name, description });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteFolder = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'folders', id));
    } catch (e) {
      console.error(e);
    }
  };

  return { folders, createFolder, updateFolder, deleteFolder };
};
