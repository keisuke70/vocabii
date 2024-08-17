import React from "react";

const AddPageSkeleton: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full h-8 bg-gray-200 rounded animate-pulse mt-2 mb-2"></div>
        <div className="w-60 md:w-96 h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse mt-2"></div>
      </div>
    </div>
  );
};

export default AddPageSkeleton;
