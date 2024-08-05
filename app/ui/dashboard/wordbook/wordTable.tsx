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
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./WordTable.css"; // Import the CSS file for transitions

export interface word {
  id: number;
  word: string;
  pronunciation: string;
  keymeanings: string[];
  audiourl?: string;
  examplesentences: string[];
  detaileddescription: string;
  nounplural?: string | null;
  verbconjugations?: string | null;
}

interface WordTableProps {
  words: word[];
}

const WordTable: React.FC<WordTableProps> = ({ words }) => {
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const nodeRef = useRef(null);

  const handleWordClick = (wordId: number) => {
    if (selectedWordId === wordId) {
      setSelectedWordId(null);
    } else {
      setSelectedWordId(null); // Close any open row first
      setTimeout(() => {
        setSelectedWordId(wordId);
      }, 300); // Delay to allow closing animation to complete
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow
            className="grid grid-cols-5 border-b border-gray-300"
            style={{ gridTemplateColumns: "1fr 1fr 1fr 2fr" }}
          >
            <TableHead className="py-2 px-4 border-r border-gray-300 text-left">
              <div className="flex justify-center items-center">Word</div>
            </TableHead>
            <TableHead className="py-2 px-4 border-r border-gray-300 text-left">
              <div className="flex justify-center items-center">Pronunciation</div>
            </TableHead>
            <TableHead className="py-2 px-4 border-r border-gray-300 text-left">
              <div className="flex justify-center items-center">Play Pronunciation</div>
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
                className="grid grid-cols-5 cursor-pointer hover:bg-gray-100 border-b border-gray-300"
                style={{ gridTemplateColumns: "1fr 1fr 1fr 2fr" }}
              >
                <TableCell className="text-base border-r font-medium border-gray-300 align-middle">
                  <div className="flex justify-center items-center h-full py-4">{word.word}</div>
                </TableCell>
                <TableCell className="text-base border-r border-gray-300 align-middle">
                  <div className="flex justify-center items-center h-full py-4">{word.pronunciation}</div>
                </TableCell>
                <TableCell className="border-r border-gray-300">
                  <div className="py-4 flex justify-center">
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
                      <li key={index}>{km}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
              <TransitionGroup component={null}>
                {selectedWordId === word.id && (
                  <CSSTransition
                    key={word.id}
                    nodeRef={nodeRef}
                    timeout={600}
                    classNames="word-detail"
                  >
                    <TableRow ref={nodeRef} className="grid grid-cols-1 bg-gray-50">
                      <TableCell colSpan={4} className="py-3 px-3 flex justify-center items-center">
                        <WordDetail
                          exampleSentences={word.examplesentences}
                          detailedDescription={word.detaileddescription}
                          nounPlural={word.nounplural}
                          verbConjugations={word.verbconjugations}
                        />
                      </TableCell>
                    </TableRow>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WordTable;
