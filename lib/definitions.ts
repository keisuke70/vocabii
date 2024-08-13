export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
  };


export interface Word {
    id: number;
    word: string;
    pronunciation: string;
    keymeanings: string;
    audiourl?: string;
    examplesentences: string;
    detaileddescription: string;
  }

export interface Details {
  word: string;
  pronunciation: string;
  keyMeanings: string[];
  exampleSentences: string[];
  detailedDescription: string;
  audioUrl: string;
  nounPlural: string | null;
  verbConjugations: string | null;
}