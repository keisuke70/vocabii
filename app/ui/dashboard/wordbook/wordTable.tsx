"use client";

import React, { useState, useRef } from "react";
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
import { CSSTransition } from "react-transition-group";
import "./WordTable.css"; // Import the CSS file for transitions

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
  const nodeRef = useRef(null);

  const handleWordClick = (wordId: number) => {
    setSelectedWordId(selectedWordId === wordId ? null : wordId);
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="grid grid-cols-4 border-b border-gray-300">
            <TableHead className="py-2 px-4 border-r border-gray-300 text-left align-middle">
              <div className="pl-4">Word</div>
            </TableHead>
            <TableHead className="py-2 px-4 border-r border-gray-300 text-left align-middle">
              <div className="pl-4">Pronunciation</div>
            </TableHead>
            <TableHead className="py-2 px-4 border-r border-gray-300 text-left align-middle">
              <div className="pl-4">Play Pronunciation</div>
            </TableHead>
            <TableHead className="py-2 px-4 text-left align-middle">
              <div className="pl-4">Key Meanings</div>
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
                <TableCell className="pl-4 text-base border-r font-medium border-gray-300 align-middle">
                  <div className="py-4">{word.word}</div>
                </TableCell>
                <TableCell className="px-4 text-base border-r border-gray-300 align-middle">
                  <div className="py-4">{word.pronunciation}</div>
                </TableCell>
                <TableCell className="ml-2 pl-4 border-r border-gray-300">
                  <div className="py-4">
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
                <TableCell className="py-1 px-4 align-middle">
                  <ul className="list-disc list-inside pl-5 text-lg">
                    {word.keymeanings.map((km, index) => (
                      <li key={index}>
                        {km}
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
              <CSSTransition
                nodeRef={nodeRef}
                in={selectedWordId === word.id}
                timeout={600}
                classNames="word-detail"
                unmountOnExit
              >
                <TableRow ref={nodeRef} className="grid grid-cols-1 bg-gray-50">
                  <TableCell colSpan={4} className="py-3 px-3">
                    <WordDetail
                      exampleSentences={word.examplesentences}
                      detailedDescription={word.detaileddescription}
                    />
                  </TableCell>
                </TableRow>
              </CSSTransition>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WordTable;
