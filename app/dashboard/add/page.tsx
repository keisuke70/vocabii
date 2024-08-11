"use client";

import React, { useState, Suspense, useActionState } from "react";
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

  const handleWordChange = (term: string) => {
    setWord(term);
  };

  const handleAdding = () => {
    setAdding(true);
  };

  const handleClicked = () => {
    if(fetchWord==word) {
      return;
    }
    setFetchWord(word);
    setIsLoading(true);
  };

  const initialState: State = {
    errors: undefined,
    message: null,
  };

  const [state, formAction] = useActionState(addWord, initialState);

  return (
    <form action={formAction} autoComplete="off">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex flex-col items-center space-y-9">
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-2">Add a New Word</h1>
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
              <div className="text-lg text-center text-sky-800">{word}</div>
            </TooltipContent>
            <TooltipTrigger type="button">
              <Input
                type="text"
                name="word"
                placeholder="Enter a word"
                value={word}
                onChange={(e) => {
                  handleWordChange(e.target.value);
                }}
                className="w-60 md:w-96 text-base"
                style={{ fontSize: '16px' }}
              />
            </TooltipTrigger>
          </Tooltip>
          <Button
            type="button"
            onClick={handleClicked}
            disabled={isLoading}
            className="bg-sky-800 hover:bg-sky-900 mt-2"
          >
            {isLoading ? "Fetching..." : "Fetch Details"}
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
                className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-md hover:bg-teal-700 justify-center"
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
