import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

// 📝 Screen for Adding Words
const AddWordScreen = ({ route }) => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [words, setWords] = useState([]);

  useEffect(() => {
    const loadWords = async () => {
      const storedWords = await AsyncStorage.getItem('words');
      if (storedWords) setWords(JSON.parse(storedWords));
    };
    loadWords();
  }, []);

  const saveWord = async () => {
    if (!word || !meaning) return;

    const newWord = { word, meaning, example: example || 'No example' };
    const updatedWords = [...words, newWord];
    setWords(updatedWords);
    await AsyncStorage.setItem('words', JSON.stringify(updatedWords));

    setWord('');
    setMeaning('');
    setExample('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Polish Vocabulary</Text>
      <TextInput placeholder="Word" value={word} onChangeText={setWord} style={styles.input} />
      <TextInput placeholder="Meaning" value={meaning} onChangeText={setMeaning} style={styles.input} />
      <TextInput placeholder="Example" value={example} onChangeText={setExample} style={styles.input} />
      <TouchableOpacity onPress={saveWord}>
        <Text>Save Word</Text>
      </TouchableOpacity>
    </View>
  );
};

// 📜 Screen for Viewing Saved Words
const SavedWordsScreen = () => {
  const [words, setWords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedWord, setEditedWord] = useState('');
  const [editedMeaning, setEditedMeaning] = useState('');
  const [editedExample, setEditedExample] = useState('');

  useEffect(() => {
    const loadWords = async () => {
      const storedWords = await AsyncStorage.getItem('words');
      if (storedWords) setWords(JSON.parse(storedWords));
    };
    loadWords();
  }, []);

  const startEditing = (index, word) => {
    setEditingIndex(index);
    setEditedWord(word.word);
    setEditedMeaning(word.meaning);
    setEditedExample(word.example);
  };

  const saveEdit = async () => {
    if (editedWord.trim() === '' || editedMeaning.trim() === '') return;

    const updatedWords = [...words];
    updatedWords[editingIndex] = { 
      word: editedWord, 
      meaning: editedMeaning, 
      example: editedExample || 'No example' 
    };

    setWords(updatedWords);
    await AsyncStorage.setItem('words', JSON.stringify(updatedWords));
    setEditingIndex(null);
  };

  return (
    <View style={styles.container}> 
      <Text style={styles.title}>Saved Words</Text>
      <FlatList
        data={words}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.wordContainer}>
            {editingIndex === index ? (
              <>
                <TextInput 
                  value={editedWord} 
                  onChangeText={setEditedWord} 
                  style={styles.input} 
                />
                <TextInput 
                  value={editedMeaning} 
                  onChangeText={setEditedMeaning} 
                  style={styles.input} 
                />
                <TextInput 
                  value={editedExample} 
                  onChangeText={setEditedExample} 
                  style={styles.input} 
                />
                <TouchableOpacity onPress={saveEdit} style={styles.button}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.word}>{item.word}</Text>
                <Text>{item.meaning}</Text>
                <Text style={styles.example}>{item.example}</Text>
                <TouchableOpacity onPress={() => startEditing(index, item)} style={styles.editButton}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};


// 🏠 Main App with Bottom Navigation
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Add Word" component={AddWordScreen} />
        <Tab.Screen name="Saved Words" component={SavedWordsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  wordContainer: { padding: 10, borderBottomWidth: 1, marginTop: 10 },
  word: { fontSize: 18, fontWeight: 'bold' },
  example: { fontStyle: 'italic' },
});