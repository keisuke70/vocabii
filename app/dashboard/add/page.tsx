"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
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
      setError("Please enter a valid word to fetch details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setDetails((prevDetails) => {
      if (name.startsWith("keyMeanings-")) {
        const index = parseInt(name.split("-")[1], 10);
        const newKeyMeanings = [...prevDetails.keyMeanings];
        newKeyMeanings[index] = value;
        return { ...prevDetails, keyMeanings: newKeyMeanings };
      } else if (name.startsWith("exampleSentences-")) {
        const index = parseInt(name.split("-")[1], 10);
        const newExampleSentences = [...prevDetails.exampleSentences];
        newExampleSentences[index] = value;
        return { ...prevDetails, exampleSentences: newExampleSentences };
      } else {
        return { ...prevDetails, [name]: value };
      }
    });
  };

  const initialState: State = {};
  const [state, formAction] = useActionState(addWord, initialState);

  return (
      <form action={formAction}>
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-2xl font-bold mt-4 mb-2">Add a New Word</h1>
            {error && <Alert className="mb-4">{error}</Alert>}
            {serverMessage && <Alert className="mb-4">{serverMessage}</Alert>}
            <Tooltip open={showTooltip}>
              <TooltipTrigger>
                <Input
                  type="text"
                  name="word"
                  placeholder="Enter a word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  className="w-full"
                />
              </TooltipTrigger>
              <TooltipContent>Word corrected to {word}</TooltipContent>
            </Tooltip>
            <Button
              type="button"
              onClick={handleFetchDetails}
              disabled={isLoading}
              className=""
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
                  value={details.pronunciation}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold">Key Meanings:</label>
                {details.keyMeanings.map((meaning, index) => (
                  <Input
                    key={index}
                    type="text"
                    name={`keyMeanings-${index}`}
                    value={meaning}
                    onChange={handleInputChange}
                    className="w-full mb-2"
                  />
                ))}
              </div>
              <div className="mb-4">
                <label className="block font-semibold">
                  Example Sentences:
                </label>
                {details.exampleSentences.map((sentence, index) => (
                  <Input
                    key={index}
                    type="text"
                    name={`exampleSentences-${index}`}
                    value={sentence}
                    onChange={handleInputChange}
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
                  value={details.detailedDescription}
                  onChange={handleInputChange}
                  className="w-full"
                  rows={6}
                />
              </div>

              <Button type="submit">Add word</Button>
            </div>
          )}
        </div>
      </form>
  );
};

export default AddWords;
