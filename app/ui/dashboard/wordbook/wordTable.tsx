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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import WordDetail from "./wordDetail";
import { FaCirclePlay, FaChevronDown, FaStar } from "react-icons/fa6";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { updateWordPriority } from "@/lib/actions";

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
  priority?: string;
}

interface WordTableProps {
  initialWords: word[]; // Rename the prop to `initialWords`
}

const WordTable: React.FC<WordTableProps> = ({ initialWords }) => {
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const nodeRef = useRef(null);
  const [words, setWords] = useState<word[]>(initialWords);

  const handleWordClick = (wordId: number) => {
    if (selectedWordId === wordId) {
      setSelectedWordId(null);
    } else {
      setSelectedWordId(null);
      setTimeout(() => {
        setSelectedWordId(wordId);
      }, 300);
    }
  };

  const handlePriorityChange = async (wordId: number, newPriority: string) => {
    setWords((prevWords) =>
      prevWords.map((word) =>
        word.id === wordId ? { ...word, priority: newPriority } : word
      )
    );
    try {
      await updateWordPriority(wordId, newPriority);
    } catch (error) {
      console.error("Failed to update priority:", error);
      setWords((prevWords) =>
        prevWords.map((word) =>
          word.id === wordId
            ? {
                ...word,
                priority: prevWords.find((w) => w.id === wordId)?.priority,
              }
            : word
        )
      );
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
                <FaCirclePlay className="ml-1 p-1 text-xl text-blue-600" />
              </div>
            </TableHead>
            <TableHead className="border-r col-span-2 md:col-span-1 border-gray-300">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-all">
                Priority
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
                className="grid grid-cols-9 md:grid-cols-5 cursor-pointer hover:bg-gray-100 border-b border-gray-300 group"
              >
                <TableCell className="p-2 text-xs col-span-2 md:col-span-1 md:text-base border-r font-medium border-gray-300 whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full min-w-[20px]">
                    {word.word}
                  </div>
                </TableCell>
                <TableCell className="p-2 text-xs col-span-2 md:col-span-1 md:text-base border-r border-gray-300 whitespace-normal break-all">
                  <div
                    className="flex justify-center items-center h-full min-w-[26px] cursor-pointer text-blue-600 hover:text-blue-900 rounded-lg bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      new Audio(word.audiourl).play();
                    }}
                  >
                    {word.pronunciation}
                  </div>
                </TableCell>
                <TableCell className="p-1 md:px-8 text-xs col-span-2 md:col-span-1 md:text-base border-r border-gray-300 whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full">
                    <Select
                      value={word.priority || ""}
                      onValueChange={(value: any) =>
                        handlePriorityChange(word.id, value)
                      }
                    >
                      <SelectTrigger className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px] xl:w-[160px] p-1 md:p-4">
                        <SelectValue>
                          <div className="flex items-center">
                            {/* Display stars in a row based on the selected priority */}
                            {word.priority === "star3" && (
                              <>
                                <FaStar className="text-yellow-500 text-xs sm:text-sm md:text-base" />
                                <FaStar className="text-yellow-500 text-xs sm:text-sm md:text-base" />
                                <FaStar className="text-yellow-500 text-xs sm:text-sm md:text-base" />
                              </>
                            )}
                            {word.priority === "star2" && (
                              <>
                                <FaStar className="text-yellow-500 text-xs sm:text-sm md:text-base" />
                                <FaStar className="text-yellow-500 text-xs sm:text-sm md:text-base" />
                              </>
                            )}
                            {word.priority === "star1" && (
                              <>
                                <FaStar className="text-yellow-500 text-xs sm:text-sm md:text-base" />
                              </>
                            )}
                            {word.priority === "remove" && (
                              <span className="text-red-500 text-xs sm:text-sm md:text-base">
                                Delete
                              </span>
                            )}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="star3">
                            <div className="flex items-center">
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                            </div>
                          </SelectItem>
                          <SelectItem value="star2">
                            <div className="flex items-center">
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                            </div>
                          </SelectItem>
                          <SelectItem value="star1">
                            <div className="flex items-center">
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                            </div>
                          </SelectItem>
                          <SelectItem value="remove">
                            <span className="text-red-500 text-xs sm:text-sm md:text-base">
                              Delete
                            </span>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
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
                        colSpan={5}
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
