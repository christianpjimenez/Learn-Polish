import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [words, setWords] = useState([]);

  useEffect(() => {
    loadWords();
  }, []);

  const saveWord = async () => {
    if (!word || !meaning || !example) return;
    const newWord = { word, meaning, example };
    const updatedWords = [...words, newWord];
    setWords(updatedWords);
    await AsyncStorage.setItem('words', JSON.stringify(updatedWords));
    setWord('');
    setMeaning('');
    setExample('');
  };

  const loadWords = async () => {
    const storedWords = await AsyncStorage.getItem('words');
    if (storedWords) {
      setWords(JSON.parse(storedWords));
    }
  };

  return (        keyExtractor={(item, index) => index.toString()}

    <View style={styles.container}>
      <Text style={styles.title}>Polish Vocabulary</Text>
      <TextInput placeholder="Word" value={word} onChangeText={setWord} style={styles.input} />
      <TextInput placeholder="Meaning" value={meaning} onChangeText={setMeaning} style={styles.input} />
      <TextInput placeholder="Example" value={example} onChangeText={setExample} style={styles.input} />
      <Button title="Save Word" onPress={saveWord} />
      <FlatList
        data={words}
        renderItem={({ item }) => (
          <View style={styles.wordContainer}>
            <Text style={styles.word}>{item.word}</Text>
            <Text>{item.meaning}</Text>
            <Text style={styles.example}>{item.example}</Text>
          </View>
        )}
      />
    </View>
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
