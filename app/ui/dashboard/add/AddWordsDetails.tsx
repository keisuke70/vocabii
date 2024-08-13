import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import AddWordSkelton from "@/app/ui/dashboard/add/skelton";
import { Button } from "@/components/ui/button";
import { FaCirclePlay } from "react-icons/fa6";
import { Details } from "@/lib/definitions";

const fetchWordDetails = async (word: string) => {
  const lowerCaseWord = word.toLowerCase();
  const response = await fetch(`/api/word-details?word=${lowerCaseWord}`);
  if (!response.ok) {
    throw new Error("Failed to fetch word details");
  }
  const data = await response.json();
  return data;
};

interface AddWordsDetailsProps {
  word: string;
  setWord: React.Dispatch<React.SetStateAction<string>>;
  setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  Isloading: boolean;
}

const AddWordsDetails: React.FC<AddWordsDetailsProps> = ({
  word,
  setWord,
  setShowTooltip,
  setIsLoading,
  Isloading,
}) => {
  const [details, setDetails] = useState<Details>({
    word: "",
    pronunciation: "",
    keyMeanings: [""],
    exampleSentences: [""],
    detailedDescription: "",
    audioUrl: "",
    nounPlural: null,
    verbConjugations: null,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (word.trim() === "") {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const fetchedDetails = await fetchWordDetails(word);
        setDetails(fetchedDetails);
        setWord(fetchedDetails.word);
        if (
          fetchedDetails.word &&
          fetchedDetails.word.toLowerCase() !== word.toLowerCase()
        ) {
          setShowTooltip(true);
          setTimeout(() => {
            setShowTooltip(false);
          }, 5000);
        }
      } catch (error) {
        setError(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [word, setShowTooltip, setIsLoading, setWord]);

  if (error) {
    return <Alert>{error}</Alert>;
  }

  if (Isloading) {
    return <AddWordSkelton />;
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block font-semibold">Pronunciation:</label>
        <div className="flex items-center space-x-6">
          <Input
            type="text"
            name="pronunciation"
            defaultValue={details.pronunciation}
           />
          <Button
            type="button"
            className="rounded-full bg-gray-700 hover:bg-gray-800 md:text-base text-xs px-2 py-1"
            onClick={() => {
              new Audio(details.audioUrl).play();
            }}
          >
            <FaCirclePlay className="mr-1 text-xs md:text-lg md:mr-2" />
            <div className="md:text-base text-xs">Play</div>
          </Button>
        </div>
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
          <Textarea
            key={index}
            name="exampleSentences"
            defaultValue={sentence}
            className="w-full mb-2 resize-none overflow-hidden whitespace-normal break-words"
            style={{ height: "auto", minHeight: "20px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        ))}
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Detailed Description:</label>
        <Textarea
          name="detailedDescription"
          defaultValue={details.detailedDescription}
          className="w-full"
          rows={6}
        />
      </div>
      {details.nounPlural && (
        <div className="mb-4">
          <label className="block font-semibold">Noun Variation:</label>
          <Input
            type="text"
            name="nounPlural"
            defaultValue={details.nounPlural || ""}
            className="w-full"
          />
        </div>
      )}
      {details.verbConjugations && (
        <div className="mb-4">
          <label className="block font-semibold">Verb Variation:</label>
          <Textarea
            name="verbConjugations"
            defaultValue={details.verbConjugations || ""}
            style={{ height: "auto", minHeight: "20px" }}
            className="w-full mb-2 resize-none overflow-hidden whitespace-normal break-words"
          />
        </div>
      )}
      <Input type="hidden" name="audioUrl" defaultValue={details.audioUrl} />
    </div>
  );
};

export default AddWordsDetails;