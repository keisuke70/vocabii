import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import AddDetaildsSkelton from "@/app/ui/dashboard/add/detailsSkeleton";
import { Button } from "@/components/ui/button";
import { FaCirclePlay, FaStar } from "react-icons/fa6";
import { Details } from "@/lib/definitions";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";

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
  const [priority, setPriority] = useState(3);
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
    return <AddDetaildsSkelton />;
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Pronunciation:</label>
        <div className="flex space-x-2">
          <Input
            type="text"
            name="pronunciation"
            defaultValue={details.pronunciation}
            style={{ fontSize: "16px" }}
            className="w-full max-w-10rem md:max-w-lg"
          />
          <div className="flex-grow flex justify-center">
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
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Key Meanings:</label>
        {details.keyMeanings.map((meaning, index) => (
          <Input
            key={index}
            type="text"
            name="keyMeanings"
            defaultValue={meaning}
            className="w-full mb-2"
            style={{ fontSize: "16px" }}
          />
        ))}
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Example Sentences:</label>
        {details.exampleSentences.map((sentence, index) => (
          <Textarea
            key={index}
            name="exampleSentences"
            defaultValue={sentence}
            className="w-full mb-2 resize-none overflow-hidden whitespace-normal break-words"
            style={{ height: "auto", minHeight: "20px", fontSize: "16px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        ))}
      </div>
      <div className="mb-4">
        <label className="block font-semibold  mb-1">
          Detailed Description:
        </label>
        <Textarea
          name="detailedDescription"
          defaultValue={details.detailedDescription}
          className="w-full"
          rows={6}
          style={{ fontSize: "16px" }}
        />
      </div>
      {details.nounPlural && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Noun Plural form:</label>
          <Input
            type="text"
            name="nounPlural"
            defaultValue={details.nounPlural || ""}
            className="w-full"
            style={{ fontSize: "16px" }}
          />
        </div>
      )}
      {details.verbConjugations && (
        <div className="mb-4">
          <label className="block font-semibold">
            <span className="block mb-1">Verb Conjugations:</span>
            <span className="block pb-2 text-xs md:text-sm">
              ・ Pres. Part., Past, Past Part., 3rd Pers. Sing.
            </span>
          </label>
          <Textarea
            name="verbConjugations"
            defaultValue={details.verbConjugations || ""}
            style={{ height: "auto", minHeight: "20px", fontSize: "16px" }}
            className="w-full mb-2 resize-none overflow-hidden whitespace-normal break-words"
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Priority:</label>
        <Select
          value={priority.toString()} // Convert number to string for Select component
          onValueChange={(value) => setPriority(parseInt(value))} // Convert back to number on change
          name="priority"
        >
          <SelectTrigger className="w-full max-w-[150px]">
            <SelectValue>
              <div className="flex items-center">
                {priority === 3 && (
                  <>
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                  </>
                )}
                {priority === 2 && (
                  <>
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                  </>
                )}
                {priority === 1 && (
                  <>
                    <FaStar className="text-yellow-500" />
                  </>
                )}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Priority</SelectLabel>
              <SelectItem value="3">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <FaStar className="text-yellow-500 mr-1" />
                  <FaStar className="text-yellow-500 mr-1" />
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <FaStar className="text-yellow-500 mr-1" />
                </div>
              </SelectItem>
              <SelectItem value="1">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Input
        type="hidden"
        name="audioUrl"
        defaultValue={details.audioUrl}
        style={{ fontSize: "16px" }}
      />
    </div>
  );
};

export default AddWordsDetails;
