"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import WordDetail from "./wordDetail";
import { FaCirclePlay } from "react-icons/fa6";

export interface Word {
  id: number;
  word: string;
  pronunciation: string;
  keyMeanings: string[];
  audioUrl: string;
  meanings: string[];
  exampleSentences: string[];
  detailedDescription: string;
}

interface WordTableProps {
  words: Word[];
}

const WordTable: React.FC<WordTableProps> = ({ words }) => {
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);

  const handleWordClick = (wordId: number) => {
    setSelectedWordId(selectedWordId === wordId ? null : wordId);
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="grid grid-cols-4 border-b border-gray-300">
            <TableHead className="py-4 pl-8 border-r border-gray-300 text-left align-middle">
              Word
            </TableHead>
            <TableHead className="py-4 px-6 border-r border-gray-300 text-left align-middle">
              Pronunciation
            </TableHead>
            <TableHead className="py-4 px-6 border-r border-gray-300 text-left align-middle">
              Play Pronunciation
            </TableHead>
            <TableHead className="py-4 px-6 text-left align-middle">
              Key Meanings
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {words.map((word) => (
            <React.Fragment key={word.id}>
              <TableRow
                onClick={() => handleWordClick(word.id)}
                className="grid grid-cols-4 cursor-pointer hover:bg-gray-100 border-b border-gray-300"
              >
                <TableCell className="py-4 pl-8 text-xl border-r special-text border-gray-300 align-middle">
                  {word.word}
                </TableCell>
                <TableCell className="py-4 px-6 text-base border-r border-gray-300 align-middle">
                  {word.pronunciation}
                </TableCell>
                <TableCell className="py-4 ml-2 pl-9  border-r border-gray-300">
                  <Button
                  className="rounded-full bg-gray-700 hover:bg-gray-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      new Audio(word.audioUrl).play();
                    }}
                  >
                    <FaCirclePlay className="mr-2 text-lg" />
                    <div className="text-base">Play</div>
                  </Button>
                </TableCell>
                <TableCell className="py-4 px-6  align-middle">
                  {word.keyMeanings.join(", ")}
                </TableCell>
              </TableRow>
              {selectedWordId === word.id && (
                <TableRow className="grid grid-cols-1 bg-gray-50">
                  <TableCell colSpan={4} className="py-3 px-3">
                    <WordDetail
                      word={word.word}
                      pronunciation={word.pronunciation}
                      meanings={word.meanings}
                      exampleSentences={word.exampleSentences}
                      detailedDescription={word.detailedDescription}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WordTable;
