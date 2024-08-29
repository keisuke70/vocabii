import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaCirclePlay } from "react-icons/fa6";
const AddWordSkeleton: React.FC = () => {
  return (
    <div>
      <div className="mb-5">
        <label className="block font-semibold animate-pulse mb-1">
          Pronunciation:
        </label>
        <div className="flex space-x-2">
          <Input
            type="text"
            className="w-full max-w-10rem md:max-w-lg animate-pulse bg-gray-200 rounded h-10"
            disabled
          />
          <div className="flex-grow flex justify-center">
            <Button
              type="button"
              className="rounded-full bg-gray-700 animate-pulse text-xs px-2 py-1"
            >
              <FaCirclePlay className="mr-1 text-xs md:text-lg md:mr-2" />
              <div className="md:text-base text-xs">Play</div>
            </Button>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label className="block font-semibold animate-pulse">
          Key Meanings:
        </label>
        <Input
          type="text"
          className="w-full mb-2 animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
        <Input
          type="text"
          className="w-full mb-2 animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
        <Input
          type="text"
          className="w-full mb-2 animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
      </div>
      <div className="mb-5">
        <label className="block font-semibold animate-pulse">
          Example Sentences:
        </label>
        <Input
          type="text"
          className="w-full mb-2 animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
        <Input
          type="text"
          className="w-full mb-2 animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
        <Input
          type="text"
          className="w-full mb-2 animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
      </div>
      <div className="mb-5">
        <label className="block font-semibold animate-pulse">
          Detailed Description:
        </label>
        <Textarea
          className="w-full animate-pulse bg-gray-200 rounded h-24"
          disabled
        />
      </div>
      <div className="mb-5">
        <label className="block font-semibold animate-pulse">
          Noun Plural Form:
        </label>
        <Input
          type="text"
          className="w-full animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
      </div>
      <div className="mb-5">
        <label className="block font-semibold animate-pulse">
          <span className="block mb-1">Verb Conjugations:</span>
          <span className="block pb-2 text-xs md:text-sm">
            ・ Pres. Part., Past, Past Part., 3rd Pers. Sing.
          </span>
        </label>
        <Input
          type="text"
          className="w-full animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
      </div>
      <div className="mb-5">
        <label className="block font-semibold mb-1 animate-pulse">
          Priority:
        </label>
        <Input
          type="text"
          className="w-full max-w-10rem animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
      </div>
    </div>
  );
};

export default AddWordSkeleton;
