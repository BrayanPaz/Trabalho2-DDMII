import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useFolders } from './useFolders';
import { useFiles, AppFile } from './useFiles';

export const usePasta = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const folderId = params.id as string;
  const folderCreatedAt = params.createdAt ? Number(params.createdAt) : Date.now();
  
  const { updateFolder, deleteFolder } = useFolders();
  const { files, createFile, updateFile, deleteFile } = useFiles(folderId);

  const [folderName, setFolderName] = useState(params.name as string);
  const [folderDesc, setFolderDesc] = useState(params.desc as string);
  const [folderCustomDate, setFolderCustomDate] = useState(params.customDate ? new Date(Number(params.customDate)) : new Date());
  const [showFolderDatePicker, setShowFolderDatePicker] = useState(false);
  
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [deleteFolderModal, setDeleteFolderModal] = useState(false);

  const [createModal, setCreateModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileDesc, setNewFileDesc] = useState('');
  // O tipo 'file' opcional guarda o arquivo cru (File Object) quando estamos na Web
  const [newFileData, setNewFileData] = useState<{uri: string, type: 'image'|'document', file?: any}|null>(null);
  const [newFileDate, setNewFileDate] = useState(new Date());
  const [showNewFileDatePicker, setShowNewFileDatePicker] = useState(false);

  const [selectedFile, setSelectedFile] = useState<AppFile | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCustomDate, setEditCustomDate] = useState(new Date());
  const [showEditFileDatePicker, setShowEditFileDatePicker] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

  const handleSaveFolderName = () => {
    if (folderName.trim() === '') {
      setFolderName(params.name as string);
      Alert.alert('Aviso', 'O nome da pasta não pode ser vazio.');
      return;
    }
    updateFolder(folderId, folderName, folderDesc, folderCustomDate);
  };

  const handleSaveFolderDesc = () => {
    setIsEditingDesc(false);
    updateFolder(folderId, folderName, folderDesc, folderCustomDate);
  };

  const handleFolderDateChange = (date: Date) => {
    setFolderCustomDate(date);
    updateFolder(folderId, folderName, folderDesc, date);
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
      setNewFileData({ 
        uri: result.assets[0].uri, 
        type: 'document',
        file: result.assets[0].file // Aqui pegamos o arquivo nativo da web, crucial para upload no Cloudinary Web
      });
    }
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim() || !newFileData) {
      Alert.alert('Aviso', 'Nome e Arquivo são obrigatórios.');
      return;
    }
    // Repassamos newFileData.file para que o useFiles.ts decida se usa a URI (Mobile) ou o File (Web)
    await createFile(newFileName, newFileDesc, newFileData.uri, newFileData.type, newFileDate, newFileData.file);
    resetCreateModal();
  };

  const openFileModal = (file: AppFile) => {
    setSelectedFile(file);
    setEditTitle(file.name);
    setEditDesc(file.description);
    setEditCustomDate(file.customDate?.toDate ? file.customDate.toDate() : new Date(file.customDate));
  };

  const handleSaveFile = async () => {
    if (!editTitle.trim() || !selectedFile) return;
    const fileId = selectedFile.id;
    setSelectedFile(null);
    await updateFile(fileId, editTitle, editDesc, editCustomDate);
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
    setNewFileDate(new Date());
    setShowNewFileDatePicker(false);
  };

  return {
    folderId, folderName, folderDesc, folderCreatedAt, folderCustomDate,
    files, selectedFile,
    setFolderName, setFolderDesc, setIsEditingDesc, setDescExpanded,
    setDeleteFolderModal, setCreateModal,
    setNewFileName, setNewFileDesc, setNewFileData,
    setEditTitle, setEditDesc, setDeleteConfirmModal, setSelectedFile,
    isEditingDesc, descExpanded, deleteFolderModal, createModal,
    editTitle, editDesc, deleteConfirmModal, newFileName, newFileDesc, newFileData,
    showFolderDatePicker, setShowFolderDatePicker, handleFolderDateChange,
    newFileDate, setNewFileDate, showNewFileDatePicker, setShowNewFileDatePicker,
    editCustomDate, setEditCustomDate, showEditFileDatePicker, setShowEditFileDatePicker,
    handleSaveFolderName, handleSaveFolderDesc, confirmDeleteFolder,
    pickImage, pickDocument, handleCreateFile, openFileModal, handleSaveFile,
    confirmDeleteFile, resetCreateModal
  };
};