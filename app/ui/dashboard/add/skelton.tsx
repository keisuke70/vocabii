import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AddWordSkeleton: React.FC = () => {
  return (
    <div>
      <div className="mb-4">
        <label className="block font-semibold animate-pulse">Pronunciation:</label>
        <Input
          type="text"
          className="w-full animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold animate-pulse">Key Meanings:</label>
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
      <div className="mb-4">
        <label className="block font-semibold animate-pulse">Example Sentences:</label>
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
      <div className="mb-4">
        <label className="block font-semibold animate-pulse">Detailed Description:</label>
        <Textarea
          className="w-full animate-pulse bg-gray-200 rounded h-24"
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold animate-pulse">Noun Variation:</label>
        <Input
          type="text"
          className="w-full animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold animate-pulse">Verb Variation:</label>
        <Input
          type="text"
          className="w-full animate-pulse bg-gray-200 rounded h-10"
          disabled
        />
      </div>
      <Input
        type="hidden"
        className="animate-pulse bg-gray-200 rounded"
        disabled
      />
    </div>
  );
};

export default AddWordSkeleton;
