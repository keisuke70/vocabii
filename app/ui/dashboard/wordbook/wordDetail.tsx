import React from 'react';

interface WordDetailProps {
  exampleSentences: string[];
  detailedDescription: string;
}

const WordDetail: React.FC<WordDetailProps> = ({ exampleSentences, detailedDescription }) => {
  return (
    <div className="p-3 bg-gray-50 rounded-md shadow-md">
      
      <p className="text-lg mb-2"><strong>Detailed Description:</strong></p>
      <h3 className="text-lg mb-2">{detailedDescription}</h3>
      <p className="text-lg mb-2"><strong>Example Sentences:</strong></p>
      <ul className="list-disc list-inside pl-5 text-lg">
        {exampleSentences.map((sentence, index) => (
          <li key={index} className="mb-1">{sentence}</li>
        ))}
      </ul>
    </div>
  );
};

export default WordDetail;
