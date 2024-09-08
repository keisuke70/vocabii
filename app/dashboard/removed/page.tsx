"use client";

import React, { useState, useEffect } from "react";
import RemovedWordTable from "../../ui/dashboard/wordbook/removedWordTable";
import { deleteSelected, fetchRemovedWord } from "@/lib/data";
import DeleteButton from "@/app/ui/standalone/deleteButton";
import { word } from "@/lib/definitions";
import RemovedDashboardSkeleton from "@/app/ui/dashboard/wordbook/removedDashboardSkeleton";

const Removed: React.FC = () => {
  const [fetchedWords, setFetchedWords] = useState<word[]>([]);
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const words = await fetchRemovedWord();
        setFetchedWords(words);
      } catch (error) {
        console.error("Failed to fetch words:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteWords = async () => {
    if (selectedWordIds.length > 0) {
      try {
        setLoading(true);
        await deleteSelected(selectedWordIds);
        setFetchedWords((prevWords) =>
          prevWords.filter((word) => !selectedWordIds.includes(word.id))
        );
        setSelectedWordIds([]);
      } catch (error) {
        console.error("Failed to delete selected words:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <RemovedDashboardSkeleton />;
  }

  return (
    <div>
      <h1 className="mb-3 text-xl md:text-3xl font-bold mt-2 bg-gradient-to-r from-pink-300 to-pink-800 bg-clip-text text-transparent drop-shadow-lg">
        Removed WordTable
      </h1>
      <RemovedWordTable
        initialWords={fetchedWords}
        setWords={setFetchedWords}
        setSelectedWordIds={setSelectedWordIds}
        selectedWordIds={selectedWordIds}
      />
      <DeleteButton
        onClick={handleDeleteWords}
        disabled={selectedWordIds.length === 0}
      />
    </div>
  );
};

export default Removed;
