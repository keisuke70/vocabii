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
  onFieldChange: (fieldName: string) => void;
}

const AddWordsDetails: React.FC<AddWordsDetailsProps> = ({
  word,
  setWord,
  setShowTooltip,
  setIsLoading,
  Isloading,
  onFieldChange,
}) => {
  const [details, setDetails] = useState<Details & { wordId: string | null }>({
    word: "",
    pronunciation: "",
    keyMeanings: [""],
    exampleSentences: [""],
    detailedDescription: "",
    audioUrl: "",
    nounPlural: null,
    verbConjugations: null,
    wordId: null,
  });
  const [error, setError] = useState("");
  const [priority, setPriority] = useState(3);

  // State for controlled input values
  const [inputValues, setInputValues] = useState({
    Pronunciation: "",
    KeyMeanings: [""],
    ExampleSentences: [""],
    DetailedDescription: "",
  });

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    details.exampleSentences.forEach((_, index) => {
      const textarea = document.getElementById(
        `exampleSentence-${index}`
      ) as HTMLTextAreaElement;
      if (textarea) adjustTextareaHeight(textarea);
    });
  }, [details.exampleSentences]);

  useEffect(() => {
    if (word.trim() === "") {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const fetchedDetails = await fetchWordDetails(word);
        setDetails({
          word: fetchedDetails.word,
          pronunciation: fetchedDetails.pronunciation,
          keyMeanings: fetchedDetails.keyMeanings || [],
          exampleSentences: fetchedDetails.exampleSentences || [],
          detailedDescription: fetchedDetails.detailedDescription || "",
          audioUrl: fetchedDetails.audioUrl || "",
          nounPlural: fetchedDetails.nounPlural || null,
          verbConjugations: fetchedDetails.verbConjugations || null,
          wordId: fetchedDetails.wordId || null,
        });

        // Update input state to reflect fetched details
        setInputValues({
          Pronunciation: fetchedDetails.pronunciation,
          KeyMeanings: fetchedDetails.keyMeanings || [],
          ExampleSentences: fetchedDetails.exampleSentences || [],
          DetailedDescription: fetchedDetails.detailedDescription || "",
        });

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

  const handleInputChange = (name: string, value: any) => {
    onFieldChange(name);
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div>
      <div className="mb-5">
        <label className="block font-semibold mb-1">Pronunciation:</label>
        <div className="flex space-x-2">
          <Input
            type="text"
            name="Pronunciation"
            value={inputValues.Pronunciation}
            style={{ fontSize: "16px" }}
            className="w-full max-w-10rem md:max-w-lg"
            onKeyDown={handleKeyDown}
            onChange={(e) => handleInputChange("Pronunciation", e.target.value)}
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
      <div className="mb-5">
        <label className="block font-semibold mb-1">Key Meanings:</label>
        {inputValues.KeyMeanings.map((meaning, index) => (
          <Input
            key={index}
            type="text"
            name={`KeyMeanings`}
            value={meaning}
            className="w-full mb-2"
            style={{ fontSize: "16px" }}
            onKeyDown={handleKeyDown}
            onChange={(e) =>
              handleInputChange("KeyMeanings", [
                ...inputValues.KeyMeanings.slice(0, index),
                e.target.value,
                ...inputValues.KeyMeanings.slice(index + 1),
              ])
            }
          />
        ))}
      </div>
      <div className="mb-5">
        <label className="block font-semibold mb-1">Example Sentences:</label>
        {inputValues.ExampleSentences.map((sentence, index) => (
          <Textarea
            key={index}
            id={`exampleSentence-${index}`}
            name={`ExampleSentences`}
            value={sentence}
            className="w-full mb-2 resize-none overflow-hidden"
            style={{ height: "auto", minHeight: "12px", fontSize: "16px" }}
            onInput={(e) => {
              adjustTextareaHeight(e.currentTarget);
              handleInputChange("ExampleSentences", [
                ...inputValues.ExampleSentences.slice(0, index),
                e.currentTarget.value,
                ...inputValues.ExampleSentences.slice(index + 1),
              ]);
            }}
          />
        ))}
      </div>
      <div className="mb-5">
        <label className="block font-semibold mb-1">
          Detailed Description:
        </label>
        <Textarea
          name="DetailedDescription"
          value={inputValues.DetailedDescription}
          className="w-full"
          rows={6}
          style={{ fontSize: "16px" }}
          onChange={(e) =>
            handleInputChange("DetailedDescription", e.target.value)
          }
        />
      </div>
      {details.nounPlural && (
        <div className="mb-5">
          <label className="block font-semibold mb-1">Noun Plural form:</label>
          <Input
            type="text"
            name="NounPlural"
            value={details.nounPlural || ""}
            className="w-full"
            style={{ fontSize: "16px" }}
            onKeyDown={handleKeyDown}
            onChange={(e) => handleInputChange("NounPlural", e.target.value)}
          />
        </div>
      )}
      {details.verbConjugations && (
        <div className="mb-5">
          <label className="block font-semibold">
            <span className="block mb-1">Verb Conjugations:</span>
            <span className="block pb-2 text-xs md:text-sm">
              ・ Pres. Part., Past, Past Part., 3rd Pers. Sing.
            </span>
          </label>
          <Textarea
            name="VerbConjugations"
            value={details.verbConjugations || ""}
            style={{ height: "auto", minHeight: "20px", fontSize: "16px" }}
            className="w-full mb-2 resize-none overflow-hidden whitespace-normal break-words"
            onChange={(e) => handleInputChange("VerbConjugations", e.target.value)}
          />
        </div>
      )}
      <div className="mb-5">
        <label className="block font-semibold mb-1">Priority:</label>
        <Select
          value={priority.toString()}
          onValueChange={(value) => {
            setPriority(parseInt(value));
            handleInputChange("priority", value);
          }}
          name="priority"
        >
          <SelectTrigger className="w-full max-w-[150px]">
            <SelectValue>
              <div className="flex items-center">
                {priority === 3 && (
                  <>
                    <FaStar className="text-yellow-300 ml-1" />
                    <FaStar className="text-yellow-300 ml-1" />
                    <FaStar className="text-yellow-300 ml-1" />
                  </>
                )}
                {priority === 2 && (
                  <>
                    <FaStar className="text-yellow-300 ml-1" />
                    <FaStar className="text-yellow-300 ml-1" />
                  </>
                )}
                {priority === 1 && (
                  <>
                    <FaStar className="text-yellow-300 ml-1" />
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
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                </div>
              </SelectItem>
              <SelectItem value="1">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500" />
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Input
        type="hidden"
        name="audioUrl"
        value={details.audioUrl}
        style={{ fontSize: "16px" }}
      />
      <Input type="hidden" name="wordId" value={details.wordId || ""} />
    </div>
  );
};

export default React.memo(AddWordsDetails);
