"use client";

import React, { useState, useEffect } from 'react';
import RemovedWordTable from '../../ui/dashboard/wordbook/removedWordTable';
import { fetchRemovedWord } from '@/lib/actions';
import DeleteButton from '@/app/ui/standalone/deleteButton';
import { word } from '@/lib/definitions';

const Removed: React.FC = () => {
  const [fetchedWords, setFetchedWords] = useState<any[]>([]);
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const words = await fetchRemovedWord();
        setFetchedWords(words);
      } catch (error) {
        console.error("Failed to fetch words:", error);
      }
    };

    fetchData();
  }, []);



  const handleDeleteWords = async () => {
    try {
      console.log("Deleted words with IDs:", selectedWordIds);
    } catch (error) {
      console.error("Failed to delete words:", error);
    }
  };

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
