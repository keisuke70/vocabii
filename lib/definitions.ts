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