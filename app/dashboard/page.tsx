"use client"
import React, { useState } from 'react';
import WordTable, { Word } from '../ui/dashboard/wordbook/wordTable';
import WordDetail from '../ui/dashboard/wordbook/wordDetail';


const Dashboard: React.FC = () => {
  const [words, setWords] = useState<Word[]>([
    // Example words data, replace with actual data
    { id: 1, word: 'example', pronunciation: 'ɪɡˈzæmpəl', keyMeanings: ['a representative form', 'an instance'], audioUrl: '/path/to/audio1.mp3' },
    // Add more word data here
  ]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const handleWordClick = (wordId: number) => {
    const word = words.find(w => w.id === wordId);
    if (word) {
      setSelectedWord(word);
    }
  };

  return (
    <div>
      <WordTable words={words} onWordClick={handleWordClick} />
      {selectedWord && (
        <WordDetail
          word={selectedWord.word}
          pronunciation={selectedWord.pronunciation}
          meanings={selectedWord.keyMeanings}
          exampleSentences={['Example sentence 1', 'Example sentence 2']} // Replace with actual example sentences
          audioUrl={selectedWord.audioUrl}
        />
      )}
    </div>
  );
};

export default Dashboard;

