'use client'

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
import { FaCirclePlay, FaChevronDown } from "react-icons/fa6";
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
    <div>
      <Table className="min-w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="grid grid-cols-9 md:grid-cols-5 border-b border-gray-300">
            <TableHead className="border-r col-span-2 md:col-span-1 border-gray-300">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-all">
                Word
              </div>
            </TableHead>
            <TableHead className="border-r col-span-2 md:col-span-1 border-gray-300">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-all">
                Pron.
              </div>
            </TableHead>
            <TableHead className="border-r col-span-2 md:col-span-1 border-gray-300">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-word">
                Play Pron.
              </div>
            </TableHead>
            <TableHead className="col-span-3 md:col-span-2">
              <div className="flex justify-center items-center h-full min-w-[70px] text-xs md:text-base whitespace-normal break-word">
                Key Meanings
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {words.map((word) => (
            <React.Fragment key={word.id}>
              <TableRow
                onClick={() => handleWordClick(word.id)}
                className="grid grid-cols-9 md:grid-cols-5 cursor-pointer hover:bg-gray-100 border-b border-gray-300 relative group"
              >
                <TableCell className="text-xs col-span-2 md:col-span-1 md:text-base border-r font-medium border-gray-300 whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full min-w-[20px]">
                    {word.word}
                  </div>
                </TableCell>
                <TableCell className="text-xs col-span-2 md:col-span-1 md:text-base border-r border-gray-300 whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full min-w-[26px]">
                    {word.pronunciation}
                  </div>
                </TableCell>
                <TableCell className="border-r col-span-2 md:col-span-1 border-gray-300">
                  <div className="flex justify-center items-center h-full min-w-[20px] whitespace-normal break-all">
                    <Button
                      className="rounded-full bg-gray-700 hover:bg-gray-800 md:text-base text-xs px-2 py-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        new Audio(word.audiourl).play();
                      }}
                    >
                      <FaCirclePlay className="mr-1 text-xs md:text-lg md:mr-2" />
                      <div className="md:text-base text-xs">Play</div>
                    </Button>
                  </div>
                  {/* Icon visible when the row is hovered */}
                  <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </TableCell>
                <TableCell className="py-1 col-span-3 md:col-span-2 whitespace-normal break-word">
                  <ul className="list-disc list-inside sm:pl-5 md:text-lg text-xs">
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
                    <TableRow
                      ref={nodeRef}
                      className="grid grid-cols-1 bg-gray-50"
                    >
                      <TableCell
                        colSpan={4}
                        className="py-3 px-3 flex justify-center items-center whitespace-normal break-all"
                      >
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
