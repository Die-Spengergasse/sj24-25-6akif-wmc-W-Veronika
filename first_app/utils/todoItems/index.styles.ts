import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    pickerWrapper: {
      marginBottom: 40,  // Platz für den Picker
    },
    pickerContainer: {
      width: '100%',
      height: 48,  // Feste Höhe definiert
      backgroundColor: '#e0e0e0',
      borderRadius: 8,
      justifyContent: 'center',
      marginBottom: 12,
    },
    picker: {
      width: '100%',
      height: 55,  // Feste Höhe für den Picker
      color: '#000',  // Textfarbe
    },
    card: {
      backgroundColor: '#f2f2f2',
      padding: 20,
      borderRadius: 12,
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: '#666',
    },
  });
  