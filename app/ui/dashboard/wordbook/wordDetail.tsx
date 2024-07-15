import React from 'react';

interface WordDetailProps {
  word: string;
  pronunciation: string;
  meanings: string[];
  exampleSentences: string[];
  detailedDescription: string;
}

const WordDetail: React.FC<WordDetailProps> = ({ word, pronunciation, meanings, exampleSentences, detailedDescription }) => {
  return (
    <div className="p-3 bg-gray-50 rounded-md shadow-md">
      
      <p className="text-lg mb-2"><strong>Pronunciation:</strong> {pronunciation}</p>
      <p className="text-lg mb-4"><strong>Detailed Description:</strong> {detailedDescription}</p>
      <h4 className="font-semibold text-lg mt-4">Meanings:</h4>
      <ul className="list-disc list-inside pl-5 text-lg">
        {meanings.map((meaning, index) => (
          <li key={index} className="mb-1">{meaning}</li>
        ))}
      </ul>
      <h4 className="font-semibold text-lg mt-4">Example Sentences:</h4>
      <ul className="list-disc list-inside pl-5 text-lg">
        {exampleSentences.map((sentence, index) => (
          <li key={index} className="mb-1">{sentence}</li>
        ))}
      </ul>
    </div>
  );
};

export default WordDetail;
