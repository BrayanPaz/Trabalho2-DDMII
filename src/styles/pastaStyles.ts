import { StyleSheet, Dimensions } from 'react-native';

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemSize = (screenWidth - 32) / numColumns;

export const pastaStyles = StyleSheet.create({
  // ... mantenha seu design ...
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#ffffff', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backBtn: { width: 40, height: 40, backgroundColor: '#f1f5f9', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backText: { color: '#4f46e5', fontSize: 24, fontWeight: '600', lineHeight: 28 },
  titleInput: { fontSize: 22, fontWeight: '800', flex: 1, color: '#1e293b' },
  deleteFolderBtn: { backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  deleteFolderText: { color: '#ef4444', fontSize: 14, fontWeight: '700' },
  
  descSection: { paddingVertical: 20, paddingHorizontal: 12 },
  
  /* ESTILOS DE DATAS CABEÇALHO PASTA */
  folderDateContainer: {
    marginBottom: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4
  },
  folderDateGray: { color: '#94a3b8', fontSize: 13, fontWeight: '500' },
  folderDateEditable: { color: '#4f46e5', fontSize: 13, fontWeight: '700' },

  descCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  descText: { fontSize: 15, color: '#475569', lineHeight: 22 },
  descPlaceholder: { fontSize: 15, color: '#94a3b8', fontStyle: 'italic' },
  descInput: { fontSize: 15, color: '#1e293b', backgroundColor: '#ffffff', padding: 16, borderRadius: 16, minHeight: 80, textAlignVertical: 'top', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  readMore: { color: '#4f46e5', marginTop: 10, fontWeight: '700', alignSelf: 'flex-end', marginRight: 5 },
  list: { paddingHorizontal: 8, paddingBottom: 100 },
  
  fileItem: { 
    width: itemSize, 
    // Aumentamos a altura levemente para acomodar as datas
    height: itemSize + 24, 
    padding: 4, 
    margin: 4 
  },
  fileBox: { flex: 1, borderRadius: 16, backgroundColor: '#e2e8f0', overflow: 'hidden' },
  
  /* ESTILOS DE DATAS LISTA DE ARQUIVOS */
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    gap: 2
  },
  dateGray: { color: '#94a3b8', fontSize: 10, flex: 1, textAlign: 'left' },
  dateVibrant: { color: '#4f46e5', fontSize: 10, fontWeight: '700', flex: 1, textAlign: 'right' },

  /* ESTILOS DE DATAS MODAIS DE CRIAÇÃO E EDIÇÃO */
  datePickerBtn: { backgroundColor: '#e0e7ff', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  datePickerText: { color: '#4f46e5', fontWeight: '700', fontSize: 15 },
  bottomDateEditableBtn: { alignSelf: 'center', marginBottom: 20, padding: 10, backgroundColor: '#f1f5f9', borderRadius: 12, width: '100%', alignItems: 'center' },
  bottomDateEditableText: { color: '#4f46e5', fontSize: 16, fontWeight: '700' },

  // ... rest of your modal and layout styles ...
  docBox: { backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', padding: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  docIcon: { fontSize: 24, marginBottom: 8 },
  docName: { color: '#334155', fontSize: 11, textAlign: 'center', fontWeight: '600' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#4f46e5', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: '300', marginTop: -2 },
  modalBg: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#ffffff', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  uploadButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 10 },
  btnUpload: { flex: 1, padding: 16, backgroundColor: '#f1f5f9', borderRadius: 16, alignItems: 'center' },
  btnUploadActive: { backgroundColor: '#e0e7ff', borderColor: '#4f46e5', borderWidth: 1 },
  uploadText: { color: '#64748b', fontWeight: '600' },
  uploadTextActive: { color: '#4f46e5', fontWeight: '700' },
  input: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 16, marginBottom: 12, fontSize: 15, color: '#1e293b' },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 10 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  saveBtn: { backgroundColor: '#4f46e5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  deleteBtnAction: { backgroundColor: '#ef4444', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  cancelText: { color: '#64748b', fontSize: 16, fontWeight: '600' },
  saveTextWhite: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  deleteTextWhite: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  modalContentFullscreen: { backgroundColor: '#ffffff', padding: 24, borderRadius: 24, flex: 0.85, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  closeBtn: { position: 'absolute', top: 20, right: 20, zIndex: 10, width: 36, height: 36, backgroundColor: '#f1f5f9', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 18, fontWeight: '800', color: '#64748b' },
  editTitleInput: { fontSize: 24, fontWeight: '800', color: '#1e293b', borderBottomWidth: 2, borderColor: '#e2e8f0', paddingBottom: 8, marginBottom: 4, marginTop: 10 },
  errorText: { color: '#ef4444', fontSize: 12, marginBottom: 10 },
  previewContainer: { flex: 1, marginVertical: 16, backgroundColor: '#f8fafc', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9' },
  previewImage: { width: '100%', height: '100%' },
  docBoxLarge: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  docIconLarge: { fontSize: 64, marginBottom: 20 },
  docNameLarge: { fontSize: 18, color: '#334155', fontWeight: '700', textAlign: 'center' },
  editDescInput: { backgroundColor: '#f1f5f9', borderRadius: 16, padding: 16, minHeight: 100, textAlignVertical: 'top', marginBottom: 20, fontSize: 15, color: '#1e293b' },
  saveBtnFull: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  btnDisabled: { opacity: 0.5 },
  deleteBtnFull: { backgroundColor: '#fee2e2', padding: 16, borderRadius: 16, alignItems: 'center' },
  downloadBtn: {
    backgroundColor: '#10b981', // Verde esmeralda para indicar uma ação positiva de download
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  downloadBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});