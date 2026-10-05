import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

const SENAI_BLUE = '#005CB9';
const ORANGE_TABLE = '#FF6B00';

const DADOS_ESTOQUE = [
  { id: '1', item: 'Parafuso', qtd: '150', un: 'un', ref: 'A1' },
  { id: '2', item: 'Alicate',  qtd: '12',  un: 'un', ref: 'B3' },
  { id: '3', item: 'Fita Isol',qtd: '45',  un: 'rl', ref: 'C2' },
  { id: '4', item: 'Cabo Flex',qtd: '200', un: 'm',  ref: 'D1' },
];

export default function Estoque({ navigation }) {
  return (
    <View style={styles.container}>
      
      {}
      <View style={styles.table}>
        
        {}
        <View style={styles.headerRow}>
          <View style={styles.headerCell}><Text style={styles.headerText}>ID</Text></View>
          <View style={styles.headerCell}><Text style={styles.headerText}>Item</Text></View>
          <View style={styles.headerCell}><Text style={styles.headerText}>Qtd</Text></View>
          <View style={styles.headerCell}><Text style={styles.headerText}>Un</Text></View>
          <View style={styles.headerCell}><Text style={styles.headerText}>Ref</Text></View>
        </View>

        {}
        <ScrollView style={styles.rowsContainer}>
          {DADOS_ESTOQUE.map((produto) => (
            <View key={produto.id} style={styles.dataRow}>
              <View style={styles.cell}><Text style={styles.cellText}>{produto.id}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{produto.item}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{produto.qtd}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{produto.un}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{produto.ref}</Text></View>
            </View>
          ))}
        </ScrollView>

      </View>

      {}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar para Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SENAI_BLUE,
    justifyContent: 'center', 
    alignItems: 'center',     
    paddingHorizontal: 20,
  },
  table: {
    backgroundColor: ORANGE_TABLE,
    borderRadius: 8,          
    padding: 10,
    width: '100%',             
    maxWidth: 450,            
    maxHeight: 400, 
    elevation: 4,             
    shadowColor: '#000',      
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  headerRow: {
    flexDirection: 'row',     
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rowsContainer: {
    width: '100%',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  backButton: {
    marginTop: 30,
    backgroundColor: '#003B75',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
