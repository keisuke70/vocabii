"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addWord, State } from "@/lib/actions";
import { useActionState } from "react";

const fetchWordDetails = async (word: string) => {
  const response = await fetch(`/api/word-details?word=${word}`);
  if (!response.ok) {
    throw new Error("Failed to fetch word details");
  }
  const data = await response.json();
  return data;
};

const AddWords: React.FC = () => {
  const [word, setWord] = useState("");
  const [details, setDetails] = useState({
    word: "",
    pronunciation: "",
    keyMeanings: [""],
    exampleSentences: [""],
    detailedDescription: "",
    audioUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const handleFetchDetails = async () => {
    setIsLoading(true);
    setError("");
    try {
      const fetchedDetails = await fetchWordDetails(word);
      setDetails(fetchedDetails);
      if (fetchedDetails.word && fetchedDetails.word !== word) {
        setWord(fetchedDetails.word);
        setShowTooltip(true);
        setTimeout(() => {
          setShowTooltip(false);
        }, 3000);
      }
      setIsFetched(true);
    } catch (error) {
      setError(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWord = e.target.value;
    console.log("kkkk");
    setWord(newWord);
    setDetails({
      word: "",
      pronunciation: "",
      keyMeanings: [""],
      exampleSentences: [""],
      detailedDescription: "",
      audioUrl: "",
    });
    console.log(details.pronunciation);
    setIsFetched(false);
    setError("");
    setServerMessage("");
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
          <h1 className="text-4xl font-bold mt-2 mb-2">Add a New Word</h1>
          {error && <Alert className="mb-4">{error}</Alert>}
          {state.errors && (
            <Alert className="mb-4">
              {Object.entries(state.errors).map(([key, errors]) => (
                <div key={key}>{errors.join(", ")}</div>
              ))}
            </Alert>
          )}
          {serverMessage && <Alert className="mb-4">{serverMessage}</Alert>}
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
                onChange={handleWordChange}
                className="w-96"
              />
            </TooltipTrigger>
          </Tooltip>
          <Button
            type="button"
            onClick={handleFetchDetails}
            disabled={isLoading}
            className="bg-sky-800 hover:bg-sky-900 mt-2"
          >
            {isLoading ? "Fetching..." : "Fetch Details"}
          </Button>
        </div>
        {isFetched && (
          <div>
            <div className="mb-4">
              <label className="block font-semibold">Pronunciation:</label>
              <Input
                type="text"
                name="pronunciation"
                defaultValue={details.pronunciation}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Key Meanings:</label>
              {details.keyMeanings.map((meaning, index) => (
                <Input
                  key={index}
                  type="text"
                  name="keyMeanings"
                  defaultValue={meaning}
                  className="w-full mb-2"
                />
              ))}
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Example Sentences:</label>
              {details.exampleSentences.map((sentence, index) => (
                <Input
                  key={index}
                  type="text"
                  name="exampleSentences"
                  defaultValue={sentence}
                  className="w-full mb-2"
                />
              ))}
            </div>
            <div className="mb-4">
              <label className="block font-semibold">
                Detailed Description:
              </label>
              <Textarea
                name="detailedDescription"
                defaultValue={details.detailedDescription}
                className="w-full"
                rows={6}
              />
            </div>

            {/* Hidden input field for audioUrl */}
            <Input
              type="hidden"
              name="audioUrl"
              defaultValue={details.audioUrl}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-md hover:bg-teal-700 justify-center"
              >
                Add word
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default AddWords;
