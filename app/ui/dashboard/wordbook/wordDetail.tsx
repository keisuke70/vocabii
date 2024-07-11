import React from 'react';

interface WordDetailProps {
  word: string;
  pronunciation: string;
  meanings: string[];
  exampleSentences: string[];
  audioUrl: string;
}

const WordDetail: React.FC<WordDetailProps> = ({ word, pronunciation, meanings, exampleSentences, audioUrl }) => {
  return (
    <div>
      <h2>{word}</h2>
      <p>Pronunciation: {pronunciation}</p>
      <button onClick={() => new Audio(audioUrl).play()}>Play Pronunciation</button>
      <h3>Meanings</h3>
      <ul>
        {meanings.map((meaning, index) => (
          <li key={index}>{meaning}</li>
        ))}
      </ul>
      <h3>Example Sentences</h3>
      <ul>
        {exampleSentences.map((sentence, index) => (
          <li key={index}>{sentence}</li>
        ))}
      </ul>
    </div>
  );
};

export default WordDetail;
