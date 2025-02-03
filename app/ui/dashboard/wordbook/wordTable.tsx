"use client";

import React, { useState, useRef, useEffect } from "react";
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
  SelectValue,
} from "@/components/ui/select";
import WordDetail from "./wordDetail";
import { FaCirclePlay, FaChevronDown, FaStar } from "react-icons/fa6";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { updateWordPriority } from "@/lib/data";

import "./WordTable.css"; // Import the CSS file for transitions
import { word } from "@/lib/definitions";

interface WordTableProps {
  initialWords: word[];
  isSubscribed: boolean;
}

const WordTable: React.FC<WordTableProps> = ({ initialWords, isSubscribed}) => {
  const filteredWords = initialWords.filter((word) => word.priority !== 0);
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const [disabledHover, setDisabledHover] = useState<boolean>(false);
  const nodeRef = useRef(null);
  const [words, setWords] = useState<word[]>(filteredWords);

  const sortWords = (words: word[]) => {
    return words.sort((a, b) => {
      if (b.priority !== a.priority) {
        return (b.priority || 0) - (a.priority || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  const sortedWords = sortWords([...words]);

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

  const handlePriorityChange = async (wordId: number, newPriority: number) => {
    if (newPriority === 0) {
      setWords((prevWords) => prevWords.filter((word) => word.id !== wordId));
    } else {
      setWords((prevWords) =>
        prevWords.map((word) =>
          word.id === wordId ? { ...word, priority: newPriority } : word
        )
      );
    }

    setDisabledHover(true);
    setSelectedWordId(null);

    try {
      await updateWordPriority(wordId, newPriority);
    } catch (error) {
      console.error("Failed to update priority:", error);

      if (newPriority === 0) {
        const wordToRestore = initialWords.find((word) => word.id === wordId);
        if (wordToRestore) {
          setWords((prevWords) => [...prevWords, wordToRestore]);
        }
      } else {
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
    }

    // Re-enable hover after 2 seconds
    setTimeout(() => {
      setDisabledHover(false);
    }, 2000);
  };

  return (
    <div className="shadow-xl">
      <Table className="min-w-full border-collapse border border-white bg-blue-50/10">
        <TableHeader className="shadow-md">
          <TableRow className="grid grid-cols-9 md:grid-cols-5 border-b border-white hover:bg-gray-0">
            <TableHead className="border-r col-span-2 md:col-span-1 border-white px-1 md:px-4">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-all text-outline font-bold">
                Word
              </div>
            </TableHead>
            <TableHead className="border-r col-span-2 md:col-span-1 border-white  px-1 md:px-4">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-all text-outline font-bold">
                Pron.
                <FaCirclePlay className="ml-1 p-1 md:p-0.5 text-xl text-blue-500" />
              </div>
            </TableHead>
            <TableHead className="border-r col-span-2 md:col-span-1 border-white px-1 md:px-4">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-all text-outline font-bold">
                Priority
              </div>
            </TableHead>
            <TableHead className="col-span-3 md:col-span-2">
              <div className="flex justify-center items-center h-full min-w-[70px] text-xs md:text-base whitespace-normal break-word text-outline font-bold">
                Key Meanings
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedWords.map((word) => (
            <React.Fragment key={word.id}>
              <TableRow
                onClick={() => handleWordClick(word.id)}
                className={`grid grid-cols-9 md:grid-cols-5 cursor-pointer ${
                  !disabledHover ? "hover:bg-blue-50/10" : "hover:bg-gray-0"
                } border-b border-white group`}
              >
                <TableCell className="p-2 text-xs col-span-2 md:col-span-1 md:text-base border-r font-medium border-white whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full min-w-[20px] font-bold text-outline">
                    {word.word}
                  </div>
                </TableCell>
                <TableCell className="p-2 text-xs col-span-2 md:col-span-1 md:text-base border-r border-white whitespace-normal break-all">
                  <div
                    className="flex justify-center items-center h-full min-w-[26px] cursor-pointer text-gray-100 hover:text-blue-700 rounded-lg backdrop-blur bg-white/10 hover:bg-customBlue shadow-md p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      new Audio(word.audiourl).play();
                    }}
                  >
                    {word.pronunciation}
                  </div>
                </TableCell>
                <TableCell className="md:px-8 text-xs col-span-2 md:col-span-1 md:text-base border-r border-white relative whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full">
                    <Select
                      value={word.priority?.toString() || ""}
                      onValueChange={(value) =>
                        handlePriorityChange(word.id, parseInt(value))
                      }
                    >
                      <SelectTrigger className="w-[50px] sm:w-[80px] md:w-[80px] lg:w-[100px] p-0 md:p-2 lg:p-4 backdrop-blur bg-white/5 hover:bg-customBlue shadow-md">
                        <SelectValue>
                          <div className="flex items-center">
                            {word.priority === 3 && (
                              <>
                                <FaStar className="text-yellow-300 text-xs sm:text-sm md:text-base ml-1 shadow-md" />
                                <FaStar className="text-yellow-300 text-xs sm:text-sm md:text-base md:ml-1 shadow-md" />
                                <FaStar className="text-yellow-300 text-xs sm:text-sm md:text-base md:mx-1 shadow-md" />
                              </>
                            )}
                            {word.priority === 2 && (
                              <>
                                <FaStar className="text-yellow-300 text-xs ml-1 md:ml-2 sm:text-sm md:text-base shadow-lg" />
                                <FaStar className="text-yellow-300 text-xs sm:text-sm md:text-base md:mx-1 shadow-md" />
                              </>
                            )}
                            {word.priority === 1 && (
                              <>
                                <FaStar className="text-yellow-300 text-xs ml-2 md:ml-3 sm:text-sm md:text-base shadow-md" />
                              </>
                            )}
                            {word.priority === 0 && (
                              <span className="text-red-500 text-xs sm:text-sm md:text-base">
                                Delete
                              </span>
                            )}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectGroup>
                          <SelectItem value="3">
                            <div className="flex items-center">
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                            </div>
                          </SelectItem>
                          <SelectItem value="2">
                            <div className="flex items-center">
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                            </div>
                          </SelectItem>
                          <SelectItem value="1">
                            <div className="flex items-center">
                              <FaStar className="text-yellow-500 mr-1 text-xs sm:text-sm md:text-base" />
                            </div>
                          </SelectItem>
                          <SelectItem value="0">
                            <span className="text-red-500 text-xs ml-1 md:ml-0">
                              Remove
                            </span>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <FaChevronDown className="absolute left-1 md:left-5 bottom-0 transform -translate-y-1/2 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
                </TableCell>

                <TableCell className="p-2 col-span-3 md:col-span-2 whitespace-normal break-word">
                  <ul className="list-disc list-inside sm:pl-5 md:text-lg text-xs font-medium text-black">
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
                      className="grid grid-cols-1 hover:bg-blue-50/10"
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
