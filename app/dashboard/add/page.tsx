"use client";

import React, { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addWord, State } from "@/lib/actions";
import AddWordsDetails from "@/app/ui/dashboard/add/AddWordsDetails";

const AddWords: React.FC = () => {
  const [word, setWord] = useState("");
  const [fetchWord, setFetchWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [adding, setAdding] = useState(false);

  const initialState: State = {
    errors: undefined,
    message: null,
  };

  const [state, formAction] = useActionState(addWord, initialState);

  const resetDetails = () => {
    setFetchWord("");
  };

  const clearErrors = () => {
    state.errors = undefined;
  };

  const handleAdding = () => {
    setAdding(true);
  };

  const handleWordChange = (term: string) => {
    setWord(term);
    clearErrors();
    resetDetails();
  };

  const handleClicked = () => {
    if (fetchWord === word) {
      return;
    }
    setFetchWord(word);
    setIsLoading(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (state.errors) {
      setAdding(false);
    }
  }, [state.errors]);


  return (
    <form action={formAction} autoComplete="off">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex flex-col items-center space-y-6 mb-2">
          <h1 className="text-3xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-sky-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
            Add a New Word
          </h1>

          {state.errors && (
            <Alert className="mb-4">
              {Object.entries(state.errors).map(([key, errors]) => (
                <div key={key}>{errors.join(", ")}</div>
              ))}
            </Alert>
          )}
          <Tooltip open={showTooltip}>
            <TooltipContent side="top">
              Word corrected to
              <div className="text-lg text-center text-orange-600">{word}</div>
            </TooltipContent>
            <TooltipTrigger type="button">
              <Input
                type="text"
                name="word"
                placeholder="Enter a word to search"
                value={word}
                onChange={(e) => handleWordChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-60 md:w-96 text-base shadow-xl focus:shadow-none active:opacity-[0.85] active:shadow-none"
                style={{ fontSize: "16px" }}
              />
            </TooltipTrigger>
          </Tooltip>
          <Button
            type="button"
            onClick={handleClicked}
            disabled={isLoading}
            className="bg-sky-700 hover:bg-sky-700 mt-2 shadow-mg hover:shadow-lg hover:shadow-blue-400/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          >
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>
        {fetchWord && (
          <div>
            <AddWordsDetails
              word={fetchWord}
              setWord={setWord}
              setShowTooltip={setShowTooltip}
              setIsLoading={setIsLoading}
              Isloading={isLoading}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                onClick={handleAdding}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 justify-center hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
              >
                {adding ? "Adding..." : "Add word"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default AddWords;
