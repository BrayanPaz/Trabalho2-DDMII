import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Alert, Platform } from 'react-native';

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

  // Upload de Imagens via ImgBB
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

  // Upload de Documentos para o Cloudinary (100% Grátis)
  const uploadDocumentToCloudinary = async (fileUri: string, fileName: string, webFile?: any) => {
    try {
      const formData = new FormData();
      
      if (Platform.OS === 'web' && webFile) {
        formData.append('file', webFile);
      } else if (Platform.OS === 'web') {
        const response = await fetch(fileUri);
        const blob = await response.blob();
        formData.append('file', blob, fileName);
      } else {
        formData.append('file', {
          uri: fileUri,
          name: fileName,
          type: 'application/octet-stream'
        } as any);
      }

      formData.append('upload_preset', process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
      
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        console.warn("Cloudinary Cloud Name não configurado no .env");
        return null;
      }
      
      // Correção: Modificado de /raw/upload para /auto/upload para suporte abrangente de documentos no Cloudinary
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url; 
      } else {
         console.error("Cloudinary Error:", data);
         return null;
      }
    } catch (error) {
      console.error("Erro no upload para o Cloudinary:", error);
      return null;
    }
  };

  const createFile = async (name: string, description: string, fileDataUri: string, type: 'image' | 'document', customDate: Date, webFile?: any) => {
    if (!auth.currentUser || !folderId || !name.trim()) return false;
    
    let url = fileDataUri;
    
    if (type === 'image') {
      const uploadedUrl = await uploadToImgbb(fileDataUri);
      if (!uploadedUrl) return false;
      url = uploadedUrl;
    } else if (type === 'document') {
      const uploadedUrl = await uploadDocumentToCloudinary(fileDataUri, name, webFile);
      if (!uploadedUrl) {
        Alert.alert('Erro', 'Falha ao fazer upload do documento. Verifique as configurações do Cloudinary no .env.');
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