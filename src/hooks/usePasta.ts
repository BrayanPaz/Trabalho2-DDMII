import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useFolders } from './useFolders';
import { useFiles, AppFile } from './useFiles';

export const usePasta = () => {
  const router = useRouter();
  const { id, name, desc } = useLocalSearchParams();
  const folderId = id as string;

  const { updateFolder, deleteFolder } = useFolders();
  const { files, createFile, updateFile, deleteFile } = useFiles(folderId);

  const [folderName, setFolderName] = useState(name as string);
  const [folderDesc, setFolderDesc] = useState(desc as string);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [deleteFolderModal, setDeleteFolderModal] = useState(false);

  const [createModal, setCreateModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileDesc, setNewFileDesc] = useState('');
  const [newFileData, setNewFileData] = useState<{uri: string, type: 'image'|'document'}|null>(null);

  const [selectedFile, setSelectedFile] = useState<AppFile | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

  const handleSaveFolderName = () => {
    if (folderName.trim() === '') {
      setFolderName(name as string);
      Alert.alert('Aviso', 'O nome da pasta não pode ser vazio.');
      return;
    }
    updateFolder(folderId, folderName, folderDesc);
  };

  const handleSaveFolderDesc = () => {
    setIsEditingDesc(false);
    updateFolder(folderId, folderName, folderDesc);
  };

  const confirmDeleteFolder = async () => {
    setDeleteFolderModal(false);
    await deleteFolder(folderId);
    router.replace('/Home');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.5 });
    if (!result.canceled && result.assets[0].base64) {
      setNewFileData({ uri: result.assets[0].base64, type: 'image' });
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      setNewFileData({ uri: result.assets[0].uri, type: 'document' });
    }
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim() || !newFileData) {
      Alert.alert('Aviso', 'Nome e Arquivo são obrigatórios.');
      return;
    }
    await createFile(newFileName, newFileDesc, newFileData.uri, newFileData.type);
    setCreateModal(false);
    setNewFileName(''); 
    setNewFileDesc(''); 
    setNewFileData(null);
  };

  const openFileModal = (file: AppFile) => {
    setSelectedFile(file);
    setEditTitle(file.name);
    setEditDesc(file.description);
  };

  const handleSaveFile = async () => {
    if (!editTitle.trim() || !selectedFile) return;
    const fileId = selectedFile.id;
    setSelectedFile(null);
    await updateFile(fileId, editTitle, editDesc);
  };

  const confirmDeleteFile = async () => {
    if (!selectedFile) return;
    const fileId = selectedFile.id;
    setDeleteConfirmModal(false);
    setSelectedFile(null);
    await deleteFile(fileId);
  };

  const resetCreateModal = () => {
    setCreateModal(false);
    setNewFileName('');
    setNewFileDesc('');
    setNewFileData(null);
  };

  return {
    // Data
    folderId,
    folderName,
    folderDesc,
    files,
    selectedFile,
    
    // Folder state setters
    setFolderName,
    setFolderDesc,
    setIsEditingDesc,
    setDescExpanded,
    setDeleteFolderModal,
    setCreateModal,
    
    // File state setters
    setNewFileName,
    setNewFileDesc,
    setNewFileData,
    setEditTitle,
    setEditDesc,
    setDeleteConfirmModal,
    setSelectedFile,
    
    // State getters
    isEditingDesc,
    descExpanded,
    deleteFolderModal,
    createModal,
    editTitle,
    editDesc,
    deleteConfirmModal,
    newFileName,
    newFileDesc,
    newFileData,
    
    // Folder handlers
    handleSaveFolderName,
    handleSaveFolderDesc,
    confirmDeleteFolder,
    
    // File handlers
    pickImage,
    pickDocument,
    handleCreateFile,
    openFileModal,
    handleSaveFile,
    confirmDeleteFile,
    resetCreateModal
  };
};
