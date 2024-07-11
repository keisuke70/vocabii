import React from 'react';

export interface Word {
  id: number;
  word: string;
  pronunciation: string;
  keyMeanings: string[];
  audioUrl: string;
}

interface WordTableProps {
  words: Word[];
  onWordClick: (wordId: number) => void;
}

const WordTable: React.FC<WordTableProps> = ({ words, onWordClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="grid grid-cols-4 border-b border-gray-300">
            <th className="py-4 px-6 border-r border-gray-300 text-left align-middle">Word</th>
            <th className="py-4 px-6 border-r border-gray-300 text-left align-middle">Pronunciation</th>
            <th className="py-4 px-6 border-r border-gray-300 text-left align-middle">Play Pronunciation</th>
            <th className="py-4 px-6 text-left align-middle">Key Meanings</th>
          </tr>
        </thead>
        <tbody>
          {words.map(word => (
            <tr
              key={word.id}
              onClick={() => onWordClick(word.id)}
              className="grid grid-cols-4 cursor-pointer hover:bg-gray-100 border-b border-gray-300"
            >
              <td className="py-4 px-6 border-r border-gray-300 align-middle">{word.word}</td>
              <td className="py-4 px-6 border-r border-gray-300 align-middle">{word.pronunciation}</td>
              <td className="py-4 px-6 border-r border-gray-300 align-middle">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    new Audio(word.audioUrl).play();
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Play
                </button>
              </td>
              <td className="py-4 px-6 align-middle">{word.keyMeanings.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WordTable;