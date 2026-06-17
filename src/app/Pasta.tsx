import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, 
  Modal, TextInput, ActivityIndicator, Image, ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import * as ImagePicker from 'expo-image-picker';

export default function Folder() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Estados da Pasta
  const [folder, setFolder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edição Inline da Pasta
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDescValue, setEditDescValue] = useState('');
  const [descExpanded, setDescExpanded] = useState(false);

  // Modais de Item
  const [isCreateItemModalVisible, setIsCreateItemModalVisible] = useState(false);
  const [isEditItemModalVisible, setIsEditItemModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  
  // Estados do Formulário de Item (Criar/Editar)
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemType, setItemType] = useState<'image' | 'document'>('image');
  const [itemUri, setItemUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    // Buscar dados da pasta
    const folderRef = doc(db, 'galleries', id as string);
    const unsubFolder = onSnapshot(folderRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setFolder({ id: snapshot.id, ...data });
        setEditTitleValue(data.name);
        setEditDescValue(data.description || '');
        setLoading(false);
      } else {
        Alert.alert("Erro", "Pasta não encontrada.");
        router.replace('/Home');
      }
    });

    // Buscar itens da pasta
    const qItems = query(collection(db, 'items'), where('folderId', '==', id));
    const unsubItems = onSnapshot(qItems, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsData);
    });

    return () => {
      unsubFolder();
      unsubItems();
    };
  }, [id]);

  // Funções de Edição da Pasta
  const saveFolderTitle = async () => {
    setIsEditingTitle(false);
    if (!editTitleValue.trim()) {
      setEditTitleValue(folder.name); // Reverte se vazio
      Alert.alert("Aviso", "O nome da pasta não pode ser vazio.");
      return;
    }
    if (editTitleValue !== folder.name) {
      await updateDoc(doc(db, 'galleries', id as string), { name: editTitleValue.trim() });
    }
  };

  const saveFolderDesc = async () => {
    setIsEditingDesc(false);
    if (editDescValue !== folder.description) {
      await updateDoc(doc(db, 'galleries', id as string), { description: editDescValue.trim() });
    }
  };

  const handleDeleteFolder = async () => {
    Alert.alert(
      "Excluir Pasta",
      "Tem a certeza de que deseja excluir esta pasta e todo o seu conteúdo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
            // Excluir a pasta
            await deleteDoc(doc(db, 'galleries', id as string));
            // Os itens deveriam idealmente ser excluídos em lote aqui ou via Cloud Functions
            router.replace('/Home');
          }
        }
      ]
    );
  };

  // Funções do IMGBB e Imagens
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setItemUri(result.assets[0].uri);
    }
  };

  const uploadToImgbb = async (uri: string) => {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'upload.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('image', { uri, name: filename, type } as any);

    const apiKey = process.env.EXPO_PUBLIC_IMGBB_API_KEY; 
    if (!apiKey) throw new Error("Chave IMGBB não configurada.");

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    return result.data.url;
  };

  // Funções de Criação de Item
  const handleCreateItem = async () => {
    if (!itemName.trim()) {
      Alert.alert("Aviso", "O nome do ficheiro é obrigatório.");
      return;
    }
    if (itemType === 'image' && !itemUri) {
      Alert.alert("Aviso", "Por favor, selecione uma imagem.");
      return;
    }

    setIsUploading(true);
    try {
      let finalUrl = itemUri;
      if (itemType === 'image' && itemUri) {
        finalUrl = await uploadToImgbb(itemUri);
      }

      await addDoc(collection(db, 'items'), {
        folderId: id,
        userId: auth.currentUser?.uid,
        name: itemName.trim(),
        description: itemDesc.trim(),
        type: itemType,
        url: finalUrl,
        createdAt: new Date().toISOString()
      });

      setIsCreateItemModalVisible(false);
      resetItemForm();
    } catch (error) {
      Alert.alert("Erro", "Falha ao adicionar o ficheiro.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetItemForm = () => {
    setItemName('');
    setItemDesc('');
    setItemType('image');
    setItemUri(null);
    setSelectedItem(null);
    setTitleError(false);
  };

  // Funções de Edição de Item
  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setItemName(item.name);
    setItemDesc(item.description || '');
    setIsEditItemModalVisible(true);
  };

  const handleSaveEditItem = async () => {
    if (!itemName.trim()) {
      setTitleError(true);
      return;
    }
    setTitleError(false);

    try {
      await updateDoc(doc(db, 'items', selectedItem.id), {
        name: itemName.trim(),
        description: itemDesc.trim()
      });
      setIsEditItemModalVisible(false);
      setSelectedItem(null);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível guardar as alterações.");
    }
  };

  const confirmDeleteItem = async () => {
    try {
      await deleteDoc(doc(db, 'items', selectedItem.id));
      setIsDeleteConfirmVisible(false);
      setIsEditItemModalVisible(false);
      setSelectedItem(null);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o ficheiro.");
    }
  };

  // Renderização do Cabeçalho e Itens
  const renderHeader = () => (
    <View style={styles.descContainer}>
      {isEditingDesc ? (
        <TextInput
          style={styles.descInput}
          value={editDescValue}
          onChangeText={setEditDescValue}
          onBlur={saveFolderDesc}
          autoFocus
          multiline
          placeholder="Adicionar descrição..."
          placeholderTextColor="#6b7280"
        />
      ) : (
        <TouchableOpacity onPress={() => setIsEditingDesc(true)}>
          <Text 
            style={[styles.descText, !folder?.description && styles.emptyDescText]}
            numberOfLines={descExpanded ? undefined : 3}
          >
            {folder?.description || "Clique para adicionar uma descrição à pasta..."}
          </Text>
        </TouchableOpacity>
      )}
      {folder?.description && folder.description.split('\n').length > 3 && (
        <TouchableOpacity onPress={() => setDescExpanded(!descExpanded)}>
          <Text style={styles.readMore}>{descExpanded ? "Ver menos" : "Ler mais"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemCard} onPress={() => openEditModal(item)}>
      {item.type === 'image' ? (
        <Image source={{ uri: item.url }} style={styles.itemImage} />
      ) : (
        <View style={styles.documentPreview}>
          <Text style={styles.documentName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.documentTypeLabel}>Documento</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#a855f7" /></View>;

  return (
    <View style={styles.container}>
      {/* Título Fixo no Topo */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>

        {isEditingTitle ? (
          <TextInput
            style={styles.titleInput}
            value={editTitleValue}
            onChangeText={setEditTitleValue}
            onBlur={saveFolderTitle}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditingTitle(true)} style={styles.titleContainer}>
            <Text style={styles.folderTitle} numberOfLines={1}>{folder?.name}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleDeleteFolder}>
          <Text style={styles.deleteFolderText}>Excluir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Sem imagens ou documentos.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => { resetItemForm(); setIsCreateItemModalVisible(true); }}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* MODAL: CRIAR ITEM */}
      <Modal visible={isCreateItemModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Ficheiro</Text>
              <TouchableOpacity onPress={() => setIsCreateItemModalVisible(false)}>
                <Text style={styles.closeModalText}>X</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.typeSelector}>
              <TouchableOpacity 
                style={[styles.typeBtn, itemType === 'image' && styles.typeBtnActive]} 
                onPress={() => setItemType('image')}
              >
                <Text style={styles.typeBtnText}>Imagem</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeBtn, itemType === 'document' && styles.typeBtnActive]} 
                onPress={() => setItemType('document')}
              >
                <Text style={styles.typeBtnText}>Documento</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nome do Ficheiro"
              placeholderTextColor="#9ca3af"
              value={itemName}
              onChangeText={setItemName}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição (Opcional)"
              placeholderTextColor="#9ca3af"
              value={itemDesc}
              onChangeText={setItemDesc}
              multiline
            />

            {itemType === 'image' && (
              <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                <Text style={styles.uploadBtnText}>{itemUri ? "Imagem Selecionada" : "Selecionar Imagem"}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={handleCreateItem} disabled={isUploading}>
              {isUploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Adicionar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: VISUALIZAR/EDITAR ITEM */}
      <Modal visible={isEditItemModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlayFullscreen}>
          <View style={styles.modalEditContent}>
            <View style={styles.modalHeader}>
              <TextInput
                style={[styles.modalEditTitleInput, titleError && styles.errorInput]}
                value={itemName}
                onChangeText={(text) => { setItemName(text); setTitleError(false); }}
                placeholder="Título do Ficheiro"
                placeholderTextColor="#6b7280"
              />
              <TouchableOpacity onPress={() => setIsEditItemModalVisible(false)}>
                <Text style={styles.closeModalText}>X</Text>
              </TouchableOpacity>
            </View>
            {titleError && <Text style={styles.errorText}>O título não pode ficar vazio.</Text>}

            <View style={styles.previewContainer}>
              {selectedItem?.type === 'image' ? (
                <Image source={{ uri: selectedItem?.url }} style={styles.fullImage} resizeMode="contain" />
              ) : (
                <View style={styles.documentFullPreview}>
                  <Text style={styles.documentFullTitle}>{selectedItem?.name}</Text>
                  <Text style={styles.documentFullType}>Ficheiro de Documento</Text>
                </View>
              )}
            </View>

            <View style={styles.editDescContainer}>
               <TextInput
                  style={styles.modalEditDescInput}
                  value={itemDesc}
                  onChangeText={setItemDesc}
                  placeholder="Adicionar ou mudar a descrição..."
                  placeholderTextColor="#9ca3af"
                  multiline
                />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEditItem}>
              <Text style={styles.saveBtnText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => setIsDeleteConfirmVisible(true)}>
              <Text style={styles.deleteBtnText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: CONFIRMAR EXCLUSÃO */}
      <Modal visible={isDeleteConfirmVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Confirmar Exclusão</Text>
            <Text style={styles.confirmText}>Tem a certeza de que deseja excluir este ficheiro?</Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsDeleteConfirmVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteBtn} onPress={confirmDeleteItem}>
                <Text style={styles.confirmDeleteBtnText}>Sim, excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#030712' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#111827', zIndex: 10 },
  backButton: { paddingRight: 15 },
  backText: { color: '#a855f7', fontSize: 24, fontWeight: 'bold' },
  titleContainer: { flex: 1, paddingHorizontal: 10 },
  folderTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  titleInput: { flex: 1, backgroundColor: '#1f2937', color: '#fff', borderRadius: 8, paddingHorizontal: 10, fontSize: 20, fontWeight: 'bold', marginHorizontal: 10 },
  deleteFolderText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
  descContainer: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#1f2937' },
  descText: { color: '#d1d5db', fontSize: 16, lineHeight: 24 },
  emptyDescText: { color: '#6b7280', fontStyle: 'italic' },
  descInput: { color: '#fff', fontSize: 16, lineHeight: 24, backgroundColor: '#1f2937', padding: 10, borderRadius: 8 },
  readMore: { color: '#a855f7', marginTop: 8, fontWeight: 'bold' },
  listContent: { padding: 10, paddingBottom: 100 },
  itemCard: { flex: 1, aspectRatio: 1, margin: 4, borderRadius: 8, overflow: 'hidden', backgroundColor: '#1f2937' },
  itemImage: { width: '100%', height: '100%' },
  documentPreview: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 8 },
  documentName: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  documentTypeLabel: { color: '#9ca3af', fontSize: 10, marginTop: 4 },
  emptyText: { color: '#9ca3af', textAlign: 'center', marginTop: 40 },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#9333ea', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold', lineHeight: 34 },
  
  // Modais
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalOverlayFullscreen: { flex: 1, backgroundColor: '#030712', paddingTop: 40 },
  modalContent: { width: '90%', backgroundColor: '#111827', borderRadius: 16, padding: 20 },
  modalEditContent: { flex: 1, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  closeModalText: { fontSize: 24, color: '#9ca3af', fontWeight: 'bold' },
  typeSelector: { flexDirection: 'row', marginBottom: 15, gap: 10 },
  typeBtn: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#1f2937', alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#9333ea' },
  typeBtnText: { color: '#fff', fontWeight: 'bold' },
  input: { backgroundColor: '#1f2937', color: '#fff', borderRadius: 12, padding: 16, marginBottom: 15, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  uploadBtn: { backgroundColor: '#374151', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  uploadBtnText: { color: '#d1d5db', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#9333ea', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  // Edição Modal
  modalEditTitleInput: { flex: 1, fontSize: 22, fontWeight: 'bold', color: '#fff', backgroundColor: '#1f2937', padding: 10, borderRadius: 8, marginRight: 15 },
  errorInput: { borderBottomWidth: 2, borderBottomColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginBottom: 10, marginTop: -15 },
  previewContainer: { flex: 1, backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', marginBottom: 20, justifyContent: 'center' },
  fullImage: { width: '100%', height: '100%' },
  documentFullPreview: { alignItems: 'center', justifyContent: 'center' },
  documentFullTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', padding: 20 },
  documentFullType: { color: '#9ca3af', fontSize: 16 },
  editDescContainer: { marginBottom: 20 },
  modalEditDescInput: { backgroundColor: '#1f2937', color: '#fff', borderRadius: 12, padding: 16, minHeight: 80, fontSize: 16, textAlignVertical: 'top' },
  deleteBtn: { backgroundColor: '#ef4444', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  deleteBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  // Confirmação
  confirmBox: { width: '80%', backgroundColor: '#111827', borderRadius: 16, padding: 20, alignItems: 'center' },
  confirmTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  confirmText: { color: '#d1d5db', textAlign: 'center', marginBottom: 20 },
  confirmRow: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, padding: 12, backgroundColor: '#374151', borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: '#fff' },
  confirmDeleteBtn: { flex: 1, padding: 12, backgroundColor: '#ef4444', borderRadius: 8, alignItems: 'center' },
  confirmDeleteBtnText: { color: '#fff', fontWeight: 'bold' }
});