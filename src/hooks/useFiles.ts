import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Alert } from 'react-native';

export interface AppFile {
  id: string;
  name: string;
  description: string;
  url: string;
  type: 'image' | 'document';
  createdAt: any;
  customDate: any;
}

export const useFiles = (folderId: string) => {
  const [files, setFiles] = useState<AppFile[]>([]);

  useEffect(() => {
    if (!auth.currentUser || !folderId) return;
    const q = query(collection(db, 'users', auth.currentUser.uid, 'folders', folderId, 'files'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as AppFile));
      setFiles(data);
    }, (error) => {
      console.error("Erro ao escutar ficheiros do Firestore:", error);
    });
    return () => unsub();
  }, [folderId]);

  const uploadToImgbb = async (base64Image: string) => {
    try {
      const formData = new FormData();
      formData.append('image', base64Image as any); 
      const apiKey = process.env.EXPO_PUBLIC_IMGBB_API_KEY;
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.data.url;
    } catch (error) {
      Alert.alert('Erro', 'Falha no upload da imagem.');
      return null;
    }
  };

  const uploadDocumentToCloud = async (localUri: string, fileName: string) => {
    try {
      // Busca o blob real do arquivo (funciona tanto para caminhos locais de mobile quanto blobs de web)
      const response = await fetch(localUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, fileName);

      // Faz o upload para gerar um link público acessível de qualquer lugar
      const res = await fetch('https://file.io', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        return data.link; // URL pública gerada
      }
      return null;
    } catch (error) {
      console.error('Erro ao fazer upload do documento:', error);
      return null;
    }
  };

  const createFile = async (name: string, description: string, base64Uri: string, type: 'image' | 'document', customDate: Date) => {
    if (!auth.currentUser || !folderId || !name.trim()) return false;
    
    let url = base64Uri;
    
    if (type === 'image') {
      const uploadedUrl = await uploadToImgbb(base64Uri);
      if (!uploadedUrl) return false;
      url = uploadedUrl;
    } else if (type === 'document') {
      // Realiza o upload do documento e obtém a URL pública estável
      const uploadedUrl = await uploadDocumentToCloud(base64Uri, name);
      if (!uploadedUrl) {
        Alert.alert('Erro', 'Não foi possível enviar o documento para o servidor.');
        return false;
      }
      url = uploadedUrl;
    }
  
    try {
      const now = new Date();
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'folders', folderId, 'files'), {
        name,
        description,
        url,
        type,
        createdAt: now,
        customDate: customDate || now
      });
      return true;
    } catch (e) {
      return false;
    }
  };
  const updateFile = async (id: string, name: string, description: string, customDate?: Date) => {
    if (!auth.currentUser || !folderId || !name.trim()) return;
    const payload: any = { name, description };
    if (customDate) payload.customDate = customDate;
    await updateDoc(doc(db, 'users', auth.currentUser.uid, 'folders', folderId, 'files', id), payload);
  };

  const deleteFile = async (id: string) => {
    if (!auth.currentUser || !folderId) return;
    await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'folders', folderId, 'files', id));
  };

  return { files, createFile, updateFile, deleteFile };
};