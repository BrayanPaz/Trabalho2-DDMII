import { StyleSheet, Dimensions } from 'react-native';

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemSize = (screenWidth - 48) / numColumns;

export const homeStyles = StyleSheet.create({
  // ... mantenha os estilos do topo até folderName ...
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  title: { fontSize: 26, fontWeight: '800', color: '#1e293b' },
  logoutBtn: { backgroundColor: '#fee2e2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  logoutText: { color: '#ef4444', fontSize: 14, fontWeight: '700' },
  list: { padding: 12 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: '#94a3b8', fontSize: 16, textAlign: 'center', paddingHorizontal: 40 },
  
  folderItem: { 
    width: itemSize, 
    alignItems: 'center', 
    margin: 6, 
    padding: 12, 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    elevation: 2 
  },
  folderIcon: { width: 50, height: 50, backgroundColor: '#f1f5f9', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  folderEmoji: { fontSize: 24 },
  folderName: { fontSize: 13, fontWeight: '600', color: '#475569', textAlign: 'center', lineHeight: 18, marginBottom: 8 },
  
  /* ESTILOS NOVOS DE DATA PARA HOME */
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
    gap: 4
  },
  dateGray: { color: '#94a3b8', fontSize: 10, flex: 1, textAlign: 'left' },
  dateVibrant: { color: '#4f46e5', fontSize: 10, fontWeight: '700', flex: 1, textAlign: 'right' },
  
  datePickerBtn: {
    backgroundColor: '#e0e7ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center'
  },
  datePickerText: {
    color: '#4f46e5',
    fontWeight: '700',
    fontSize: 15
  },
  // ... resto do Modal igual ...
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#4f46e5', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: '300', marginTop: -2 },
  modalBg: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#ffffff', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  input: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 16, marginBottom: 12, fontSize: 15, color: '#1e293b' },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 10 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  saveBtn: { backgroundColor: '#4f46e5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  cancelText: { color: '#64748b', fontSize: 16, fontWeight: '600' },
  saveText: { color: '#ffffff', fontSize: 16, fontWeight: '700' }
});