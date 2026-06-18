import { StyleSheet } from 'react-native';

export const signupStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#f8fafc' 
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: 30, 
    borderRadius: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    elevation: 3 
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#1e293b', 
    marginBottom: 5, 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#64748b', 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  input: { 
    backgroundColor: '#f1f5f9', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16, 
    fontSize: 16, 
    color: '#1e293b' 
  },
  button: { 
    backgroundColor: '#4f46e5', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10, 
    shadowColor: '#4f46e5', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 4 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  linkContainer: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#64748b', 
    fontSize: 14 
  },
  linkBold: { 
    color: '#4f46e5', 
    fontWeight: '700' 
  }
});
