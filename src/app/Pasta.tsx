import React from 'react';
import * as Linking from 'expo-linking';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { usePasta } from '../hooks/usePasta';
import { pastaStyles } from '../styles/pastaStyles';

const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

export default function Pasta() {
  const router = useRouter();
  const {
    folderName, folderDesc, folderCreatedAt, folderCustomDate, files, selectedFile,
    setFolderName, setFolderDesc, setIsEditingDesc, setDescExpanded,
    setDeleteFolderModal, setCreateModal, setNewFileName, setNewFileDesc,
    setEditTitle, setEditDesc, setDeleteConfirmModal, setSelectedFile,
    isEditingDesc, descExpanded, deleteFolderModal, createModal,
    editTitle, editDesc, deleteConfirmModal, newFileName, newFileDesc, newFileData,
    showFolderDatePicker, setShowFolderDatePicker, handleFolderDateChange,
    newFileDate, setNewFileDate, showNewFileDatePicker, setShowNewFileDatePicker,
    editCustomDate, setEditCustomDate, showEditFileDatePicker, setShowEditFileDatePicker,
    handleSaveFolderName, handleSaveFolderDesc, confirmDeleteFolder, pickImage, pickDocument,
    handleCreateFile, openFileModal, handleSaveFile, confirmDeleteFile, resetCreateModal
  } = usePasta();

  return (
    <View style={pastaStyles.container}>
      <View style={pastaStyles.header}>
        <TouchableOpacity style={pastaStyles.backBtn} onPress={() => router.replace('/Home')}>
          <Text style={pastaStyles.backText}>‹</Text>
        </TouchableOpacity>

        <TextInput 
          style={pastaStyles.titleInput} 
          value={folderName} 
          onChangeText={setFolderName} 
          onBlur={handleSaveFolderName} 
          selectionColor="#4f46e5"
        />
        <TouchableOpacity style={pastaStyles.deleteFolderBtn} onPress={() => setDeleteFolderModal(true)}>
          <Text style={pastaStyles.deleteFolderText}>Apagar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={files}
        numColumns={3}
        keyExtractor={item => item.id}
        contentContainerStyle={pastaStyles.list}
        ListHeaderComponent={
          <View style={pastaStyles.descSection}>
            <View style={pastaStyles.folderDateContainer}>
              <Text style={pastaStyles.folderDateGray}>Criado em: {formatTimestamp(folderCreatedAt)}</Text>
              <TouchableOpacity onPress={() => setShowFolderDatePicker(true)}>
                <Text style={pastaStyles.folderDateEditable}>Data: {formatTimestamp(folderCustomDate)} ✏️</Text>
              </TouchableOpacity>
            </View>

            {showFolderDatePicker && (
              <DateTimePicker
                value={folderCustomDate} mode="date" display="default"
                onChange={(event, date) => {
                  setShowFolderDatePicker(false);
                  if (date) handleFolderDateChange(date);
                }}
              />
            )}

            {isEditingDesc ? (
              <TextInput 
                style={pastaStyles.descInput} value={folderDesc} 
                onChangeText={setFolderDesc} onBlur={handleSaveFolderDesc} 
                autoFocus multiline placeholder="Introduza uma descrição..." placeholderTextColor="#94a3b8"
              />
            ) : (
              <TouchableOpacity activeOpacity={0.7} onPress={() => setIsEditingDesc(true)} style={pastaStyles.descCard}>
                <Text numberOfLines={descExpanded ? undefined : 3} style={folderDesc ? pastaStyles.descText : pastaStyles.descPlaceholder}>
                  {folderDesc || 'Clique aqui para adicionar uma descrição à pasta...'}
                </Text>
              </TouchableOpacity>
            )}
            {!isEditingDesc && folderDesc.length > 100 && (
              <TouchableOpacity onPress={() => setDescExpanded(!descExpanded)}>
                <Text style={pastaStyles.readMore}>{descExpanded ? 'Minimizar' : 'Ler mais...'}</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8} style={pastaStyles.fileItem} onPress={() => openFileModal(item)}>
            {item.type === 'image' ? (
               <Image source={{ uri: item.url }} style={pastaStyles.fileBox} resizeMode="cover" />
            ) : (
               <View style={[pastaStyles.fileBox, pastaStyles.docBox]}>
                 <Text style={pastaStyles.docIcon}>📄</Text>
                 <Text style={pastaStyles.docName} numberOfLines={2}>{item.name}</Text>
               </View>
            )}
            <View style={pastaStyles.dateRow}>
              <Text style={pastaStyles.dateGray} adjustsFontSizeToFit minimumFontScale={0.5} numberOfLines={1}>{formatTimestamp(item.createdAt)}</Text>
              <Text style={pastaStyles.dateVibrant} adjustsFontSizeToFit minimumFontScale={0.5} numberOfLines={1}>{formatTimestamp(item.customDate)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={pastaStyles.fab} onPress={() => setCreateModal(true)} activeOpacity={0.8}>
        <Text style={pastaStyles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={deleteFolderModal} transparent animationType="fade">
        <View style={pastaStyles.modalBg}>
          <View style={pastaStyles.modalContent}>
            <Text style={pastaStyles.modalTitle}>Excluir Pasta?</Text>
            <Text style={pastaStyles.modalSubtitle}>Esta ação apagará a pasta e todo o conteúdo. Não pode ser revertido.</Text>
            <View style={pastaStyles.modalRow}>
              <TouchableOpacity style={pastaStyles.cancelBtn} onPress={() => setDeleteFolderModal(false)}><Text style={pastaStyles.cancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={pastaStyles.deleteBtnAction} onPress={confirmDeleteFolder}><Text style={pastaStyles.deleteTextWhite}>Sim, Excluir</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={createModal} transparent animationType="slide">
        <View style={pastaStyles.modalBg}>
          <View style={pastaStyles.modalContent}>
            <Text style={pastaStyles.modalTitle}>Novo Arquivo</Text>
            <Text style={pastaStyles.modalSubtitle}>Adicione uma imagem ou documento</Text>
            <View style={pastaStyles.uploadButtons}>
              <TouchableOpacity style={[pastaStyles.btnUpload, newFileData?.type === 'image' && pastaStyles.btnUploadActive]} onPress={pickImage}>
                <Text style={newFileData?.type === 'image' ? pastaStyles.uploadTextActive : pastaStyles.uploadText}>📷 Imagem</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[pastaStyles.btnUpload, newFileData?.type === 'document' && pastaStyles.btnUploadActive]} onPress={pickDocument}>
                <Text style={newFileData?.type === 'document' ? pastaStyles.uploadTextActive : pastaStyles.uploadText}>📄 Documento</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput style={pastaStyles.input} placeholder="Nome do arquivo" placeholderTextColor="#94a3b8" value={newFileName} onChangeText={setNewFileName} />
            <TextInput style={[pastaStyles.input, pastaStyles.inputMultiline]} placeholder="Descrição (opcional)" placeholderTextColor="#94a3b8" value={newFileDesc} onChangeText={setNewFileDesc} multiline />
            
            <TouchableOpacity style={pastaStyles.datePickerBtn} onPress={() => setShowNewFileDatePicker(true)}>
              <Text style={pastaStyles.datePickerText}>Data: {newFileDate.toLocaleDateString('pt-BR')}</Text>
            </TouchableOpacity>

            {showNewFileDatePicker && (
              <DateTimePicker
                value={newFileDate} mode="date" display="default"
                onChange={(event, date) => {
                  setShowNewFileDatePicker(false);
                  if (date) setNewFileDate(date);
                }}
              />
            )}

            <View style={pastaStyles.modalRow}>
              <TouchableOpacity style={pastaStyles.cancelBtn} onPress={resetCreateModal}><Text style={pastaStyles.cancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={pastaStyles.saveBtn} onPress={handleCreateFile}><Text style={pastaStyles.saveTextWhite}>Adicionar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {selectedFile && (
        <Modal visible={true} transparent animationType="fade">
          <View style={pastaStyles.modalBg}>
            <View style={pastaStyles.modalContentFullscreen}>
              <TouchableOpacity style={pastaStyles.closeBtn} onPress={() => setSelectedFile(null)}>
                <Text style={pastaStyles.closeText}>✕</Text>
              </TouchableOpacity>
              
              <TextInput style={pastaStyles.editTitleInput} value={editTitle} onChangeText={setEditTitle} placeholder="Título" placeholderTextColor="#94a3b8"/>
              {editTitle.trim() === '' && <Text style={pastaStyles.errorText}>O título não pode ficar vazio.</Text>}

              <View style={pastaStyles.previewContainer}>
                {selectedFile.type === 'image' ? (
                  <Image source={{ uri: selectedFile?.url }} style={pastaStyles.previewImage} resizeMode="contain" />
                ) : (
                  <View style={[pastaStyles.previewImage, pastaStyles.docBoxLarge]}><Text style={pastaStyles.docIconLarge}>📄</Text><Text style={pastaStyles.docNameLarge}>{selectedFile?.name}</Text></View>
                )}
              </View>

              <TextInput 
                style={pastaStyles.editDescInput} 
                value={editDesc} 
                onChangeText={setEditDesc} 
                placeholder="Escreva uma descrição para este ficheiro..." 
                placeholderTextColor="#94a3b8"
                multiline
              />
                            
              {/* BOTÃO DE DOWNLOAD CONDICIONAL PARA DOCUMENTOS */}
              {selectedFile.type === 'document' && (
                <TouchableOpacity 
                  style={pastaStyles.downloadBtn} 
                  onPress={() => {
                    if (selectedFile?.url) {
                      Linking.openURL(selectedFile.url);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={pastaStyles.downloadBtnText}>Abrir / Baixar Documento ⬇️</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={pastaStyles.bottomDateEditableBtn} onPress={() => setShowEditFileDatePicker(true)}>
                <Text style={pastaStyles.bottomDateEditableText}>Data: {editCustomDate.toLocaleDateString('pt-BR')} ✏️</Text>
              </TouchableOpacity>

              {showEditFileDatePicker && (
                <DateTimePicker
                  value={editCustomDate} mode="date" display="default"
                  onChange={(event, date) => {
                    setShowEditFileDatePicker(false);
                    if (date) setEditCustomDate(date);
                  }}
                />
              )}

              <TouchableOpacity style={[pastaStyles.saveBtnFull, editTitle.trim() === '' && pastaStyles.btnDisabled]} onPress={handleSaveFile} disabled={editTitle.trim() === ''}>
                <Text style={pastaStyles.saveTextWhite}>Guardar Alterações</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={pastaStyles.deleteBtnFull} onPress={() => setDeleteConfirmModal(true)}>
                <Text style={pastaStyles.deleteTextWhite}>Excluir Arquivo</Text>
              </TouchableOpacity>
            </View>
          </View>

          { deleteConfirmModal && <View style={[StyleSheet.absoluteFill, pastaStyles.modalBg, { zIndex: 1000 }]}>
              <View style={pastaStyles.modalContent}>
                <Text style={pastaStyles.modalTitle}>Excluir Ficheiro</Text>
                <Text style={pastaStyles.modalSubtitle}>Tem a certeza? Este ficheiro será apagado para sempre.</Text>
                <View style={pastaStyles.modalRow}>
                  <TouchableOpacity style={pastaStyles.cancelBtn} onPress={() => setDeleteConfirmModal(false)}><Text style={pastaStyles.cancelText}>Cancelar</Text></TouchableOpacity>
                  <TouchableOpacity style={pastaStyles.deleteBtnAction} onPress={confirmDeleteFile}><Text style={pastaStyles.deleteTextWhite}>Excluir</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          }
        </Modal>
      )}
    </View>
  );
}