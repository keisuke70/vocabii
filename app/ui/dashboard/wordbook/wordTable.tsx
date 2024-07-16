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

export interface word {
  id: number;
  word: string;
  pronunciation: string;
  keymeanings: string[];
  audiourl?: string;
  examplesentences: string[];
  detaileddescription: string;
}

interface WordTableProps {
  words: word[];
}

const WordTable: React.FC<WordTableProps> = ({ words }) => {
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);

  const handleWordClick = (wordId: number) => {
    setSelectedWordId(selectedWordId === wordId ? null : wordId);
  };
  console.log(words[0].detaileddescription);

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="grid grid-cols-4 border-b border-gray-300">
            <TableHead className="py-4 px-6 border-r border-gray-300 text-left align-middle">
              <div className="pl-6">Word</div>
            </TableHead>
            <TableHead className="py-4 px-6 border-r border-gray-300 text-left align-middle">
            <div className="pl-6">Pronunciation</div>
            </TableHead>
            <TableHead className="py-4 px-6 border-r border-gray-300 text-left align-middle">
              <div className="pl-6">Play Pronunciation</div>
            </TableHead>
            <TableHead className="py-4 px-6 text-left align-middle">
              <div className="pl-6">Key Meanings</div>
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
                <TableCell className="py-4 pl-9 text-xl border-r font-medium border-gray-300 align-middle">
                  <div className="py-10 px-8">{word.word}</div>
                </TableCell>
                <TableCell className="py-4 px-6 text-base border-r border-gray-300 align-middle">
                  <div className="py-10 px-8">{word.pronunciation}</div>
                </TableCell>
                <TableCell className="py-4 ml-2 pl-9  border-r border-gray-300">
                  <div className="py-10 px-8">
                    <Button
                      className="rounded-full bg-gray-700 hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        new Audio(word.audiourl).play();
                      }}
                    >
                      <FaCirclePlay className="mr-2 text-lg" />
                      <div className="text-base">Play</div>
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6  align-middle">
                  <ul className="list-disc list-inside pl-5 text-lg">
                    {word.keymeanings.map((km, index) => (
                      <li key={index} className="mb-1">
                        {km}
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
              {selectedWordId === word.id && (
                <TableRow className="grid grid-cols-1 bg-gray-50">
                  <TableCell colSpan={4} className="py-3 px-3">
                    <WordDetail
                      exampleSentences={word.examplesentences}
                      detailedDescription={word.detaileddescription}
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
