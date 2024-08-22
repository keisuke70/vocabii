"use client";

import React, { useState, useEffect } from 'react';
import RemovedWordTable from '../../ui/dashboard/wordbook/removedWordTable';
import { deleteSelected, fetchRemovedWord } from '@/lib/actions';
import DeleteButton from '@/app/ui/standalone/deleteButton';
import { word } from '@/lib/definitions';
import RemovedDashboardSkeleton from '@/app/ui/dashboard/wordbook/removedDashboardSkeleton';

const Removed: React.FC = () => {
  const [fetchedWords, setFetchedWords] = useState<word[]>([]);
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  let fetchedWord = []

  useEffect(() => {
    const fetchData = async () => {
      try {
        const words = await fetchRemovedWord();
        setFetchedWords(words);
        fetchedWord=words;
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
    return  <RemovedDashboardSkeleton />;
  }

  return (
    <div>
      <RemovedWordTable 
        initialWords={fetchedWords} 
        setSelectedWordIds={setSelectedWordIds}
        selectedWordIds={selectedWordIds}
      />
      <DeleteButton onClick={handleDeleteWords} disabled={selectedWordIds.length === 0} />
    </div>
  );
};

export default Removed;
