import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useFolders } from '../hooks/useFolders';
import { useFiles, AppFile } from '../hooks/useFiles';

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemSize = (screenWidth - 20) / numColumns;

export default function Pasta() {
  const router = useRouter();
  const { id, name, desc } = useLocalSearchParams();
  const folderId = id as string;

  const { updateFolder, deleteFolder } = useFolders();
  const { files, createFile, updateFile, deleteFile } = useFiles(folderId);

  // Estados da Pasta
  const [folderName, setFolderName] = useState(name as string);
  const [folderDesc, setFolderDesc] = useState(desc as string);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [deleteFolderModal, setDeleteFolderModal] = useState(false); // Modal para confirmar exclusão da pasta

  // Estados dos Modais
  const [createModal, setCreateModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileDesc, setNewFileDesc] = useState('');
  const [newFileData, setNewFileData] = useState<{uri: string, type: 'image'|'document'}|null>(null);

  const [selectedFile, setSelectedFile] = useState<AppFile | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

  // --- LÓGICA DA PASTA ---
  const handleSaveFolderName = () => {
    if (folderName.trim() === '') {
      setFolderName(name as string); // reverte se vazio
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

  // --- LÓGICA DE ARQUIVOS (CREATE) ---
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
    setNewFileName(''); setNewFileDesc(''); setNewFileData(null);
  };

  // --- LÓGICA DE ARQUIVOS (EDIT/DELETE) ---
  const openFileModal = (file: AppFile) => {
    setSelectedFile(file);
    setEditTitle(file.name);
    setEditDesc(file.description);
  };

  const handleSaveFile = async () => {
    if (!editTitle.trim() || !selectedFile) return; // Validação visual já existe na UI
    
    // Guarda o ID localmente antes de limpar o estado
    const fileId = selectedFile.id;
    
    // Limpa a interface primeiro (fecha o modal instantaneamente)
    setSelectedFile(null);
    
    // Realiza o update no background
    await updateFile(fileId, editTitle, editDesc);
  };

  const confirmDeleteFile = async () => {
    if (!selectedFile) return;
    
    const fileId = selectedFile.id;
    
    // Fecha os modais instantaneamente
    setDeleteConfirmModal(false);
    setSelectedFile(null);
    
    // Processa a deleção
    await deleteFile(fileId);
  };

  return (
    <View style={styles.container}>
      {/* HEADER FIXO NO TOPO MÁXIMO */}
      <View style={styles.header}>
        {/* Botão de Voltar para a Home */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/Home')}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <TextInput 
          style={styles.titleInput} 
          value={folderName} 
          onChangeText={setFolderName} 
          onBlur={handleSaveFolderName} 
        />
        <TouchableOpacity onPress={() => setDeleteFolderModal(true)}>
          <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={files}
        numColumns={numColumns}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.descSection}>
            {isEditingDesc ? (
              <TextInput 
                style={styles.descInput} 
                value={folderDesc} 
                onChangeText={setFolderDesc} 
                onBlur={handleSaveFolderDesc} 
                autoFocus multiline 
              />
            ) : (
              <TouchableOpacity onPress={() => setIsEditingDesc(true)}>
                <Text numberOfLines={descExpanded ? undefined : 3} style={styles.descText}>
                  {folderDesc || 'Clique para adicionar uma descrição...'}
                </Text>
              </TouchableOpacity>
            )}
            {!isEditingDesc && folderDesc.length > 100 && (
              <TouchableOpacity onPress={() => setDescExpanded(!descExpanded)}>
                <Text style={styles.readMore}>{descExpanded ? 'Ler menos' : 'Ler mais'}</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.fileItem} onPress={() => openFileModal(item)}>
            {item.type === 'image' ? (
               <Image source={{ uri: item.url }} style={styles.fileBox} resizeMode="cover" />
            ) : (
               <View style={[styles.fileBox, styles.docBox]}>
                 <Text style={styles.docName} numberOfLines={2}>{item.name}</Text>
                 <Text style={styles.docType}>DOCUMENTO</Text>
               </View>
            )}
          </TouchableOpacity>
        )}
      />

      {/* FAB ADD ARQUIVO */}
      <TouchableOpacity style={styles.fab} onPress={() => setCreateModal(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* MODAL CONFIRMAR EXCLUSÃO PASTA */}
      <Modal visible={deleteFolderModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text>Deseja mesmo excluir esta pasta e todo o seu conteúdo?</Text>
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setDeleteFolderModal(false)}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity onPress={confirmDeleteFolder}><Text style={styles.deleteText}>Sim, Excluir</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL CRIAR ARQUIVO */}
      <Modal visible={createModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Arquivo</Text>
            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.btnUpload} onPress={pickImage}><Text>📷 Imagem</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnUpload} onPress={pickDocument}><Text>📄 Documento</Text></TouchableOpacity>
            </View>
            <Text style={styles.status}>{newFileData ? `Selecionado: ${newFileData.type}` : 'Nenhum arquivo'}</Text>
            
            <TextInput style={styles.input} placeholder="Nome" value={newFileName} onChangeText={setNewFileName} />
            <TextInput style={styles.input} placeholder="Descrição" value={newFileDesc} onChangeText={setNewFileDesc} />
            
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setCreateModal(false)}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleCreateFile}><Text style={styles.saveText}>Adicionar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL VER/EDITAR ARQUIVO (com o Modal de exclusão embutido) */}
      {selectedFile && (
        <Modal visible={true} transparent animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalContentFullscreen}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedFile(null)}>
                <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>
              
              <TextInput 
                style={styles.editTitleInput} 
                value={editTitle} 
                onChangeText={setEditTitle} 
                placeholder="Título"
              />
              {editTitle.trim() === '' && <Text style={styles.errorText}>O título não pode ficar vazio.</Text>}

              <View style={styles.previewContainer}>
                {selectedFile.type === 'image' ? (
                  <Image source={{ uri: selectedFile?.url }} style={styles.previewImage} resizeMode="contain" />
                ) : (
                  <View style={[styles.previewImage, styles.docBox]}><Text style={styles.docName}>{selectedFile?.name}</Text></View>
                )}
              </View>

              <TextInput 
                style={styles.editDescInput} 
                value={editDesc} 
                onChangeText={setEditDesc} 
                placeholder="Adicionar ou mudar descrição..." 
                multiline
              />

              <TouchableOpacity style={styles.saveBtnFull} onPress={handleSaveFile} disabled={editTitle.trim() === ''}>
                <Text style={styles.btnTextWhite}>Salvar Alterações</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.deleteBtnFull} onPress={() => setDeleteConfirmModal(true)}>
                <Text style={styles.btnTextWhite}>Excluir Arquivo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Renderiza a caixa de exclusão DENTRO do modal atual. 
              Isso impede os bugs nativos de sobreposição de modais. */}
          {deleteConfirmModal && (
            <View style={[StyleSheet.absoluteFill, styles.modalBg, { zIndex: 1000 }]}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                <Text>Deseja mesmo excluir este arquivo?</Text>
                <View style={styles.modalRow}>
                  <TouchableOpacity onPress={() => setDeleteConfirmModal(false)}><Text style={styles.cancelText}>Não</Text></TouchableOpacity>
                  <TouchableOpacity onPress={confirmDeleteFile}><Text style={styles.deleteText}>Sim, Excluir</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: '#fff', alignItems: 'center', elevation: 2 },
  backBtn: { marginRight: 15 },
  backText: { color: '#007bff', fontSize: 16, fontWeight: 'bold' },
  titleInput: { fontSize: 22, fontWeight: 'bold', flex: 1, color: '#000' },
  deleteText: { color: 'red', fontSize: 16, fontWeight: 'bold' },
  descSection: { padding: 15, marginBottom: 10 },
  descText: { fontSize: 16, color: '#555' },
  descInput: { fontSize: 16, color: '#000', borderBottomWidth: 1, borderColor: '#ccc' },
  readMore: { color: '#007bff', marginTop: 5, fontWeight: 'bold' },
  list: { paddingHorizontal: 10 },
  fileItem: { width: itemSize, height: itemSize, padding: 5 },
  // Adicionado overflow: 'hidden' para as imagens não vazarem o container
  fileBox: { flex: 1, borderRadius: 8, backgroundColor: '#ccc', overflow: 'hidden' },
  docBox: { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 5 },
  docName: { color: '#fff', fontSize: 12, textAlign: 'center', marginBottom: 10 },
  docType: { color: '#aaa', fontSize: 10, position: 'absolute', bottom: 5 },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#007bff', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 30 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  uploadButtons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  btnUpload: { padding: 10, backgroundColor: '#eee', borderRadius: 5 },
  status: { textAlign: 'center', marginBottom: 10, color: 'gray', fontSize: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20, marginTop: 10 },
  cancelText: { color: 'gray', fontSize: 16 },
  saveText: { color: '#007bff', fontSize: 16, fontWeight: 'bold' },
  
  // View/Edit Modal
  modalContentFullscreen: { backgroundColor: '#fff', padding: 20, borderRadius: 10, flex: 0.9 },
  closeBtn: { position: 'absolute', top: 10, right: 15, zIndex: 10 },
  closeText: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  editTitleInput: { fontSize: 22, fontWeight: 'bold', borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 5, marginTop: 20 },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10 },
  previewContainer: { flex: 1, marginVertical: 15, backgroundColor: '#f0f0f0', borderRadius: 8, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  editDescInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, minHeight: 80, textAlignVertical: 'top', marginBottom: 20 },
  saveBtnFull: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  deleteBtnFull: { backgroundColor: '#dc3545', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnTextWhite: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
