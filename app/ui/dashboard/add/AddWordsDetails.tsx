import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import AddWordSkelton from "@/app/ui/dashboard/add/skelton";

const fetchWordDetails = async (word: string) => {
  const response = await fetch(`/api/word-details?word=${word}`);
  if (!response.ok) {
    throw new Error("Failed to fetch word details");
  }
  const data = await response.json();
  return data;
};

interface AddWordsDetailsProps {
  word: string;
  setWord:  React.Dispatch<React.SetStateAction<string>>;
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
  const [details, setDetails] = useState({
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
        if (fetchedDetails.word && fetchedDetails.word !== word) {
          setShowTooltip(true);
          setWord(fetchedDetails.word);
          setTimeout(() => {
            setShowTooltip(false);
          }, 3000);
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

          <Input
            type="text"
            name="verbConjugations"
            defaultValue={details.verbConjugations || ""}
            className="w-full"
          />
        </div>
      )}
      <Input type="hidden" name="audioUrl" defaultValue={details.audioUrl} />
    </div>
  );
};

export default AddWordsDetails;
