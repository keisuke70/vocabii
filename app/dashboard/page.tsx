import AddButton from '../ui/addButton';
import WordTable from '../ui/dashboard/wordbook/wordTable';

const Dashboard: React.FC = () => {
  const words =[
    // Example words data, replace with actual data
    { id: 1, word: 'example', pronunciation: 'ɪɡˈzæmpəl', keyMeanings: ['a representative form', 'an instance'], audioUrl: '/path/to/audio1.mp3', meanings: ['a representative form', 'an instance'], exampleSentences: ['Example sentence 1', 'Example sentence 2'], detailedDescription: 'A detailed description for the word example.' },
    { id: 2, word: 'sample', pronunciation: 'ˈsæmpəl', keyMeanings: ['a part or piece taken to show the quality or nature of the whole'], audioUrl: '/path/to/audio2.mp3', meanings: ['a representative part', 'a small part'], exampleSentences: ['Sample sentence 1', 'Sample sentence 2'], detailedDescription: 'A detailed description for the word sample.' },
    // Add more word data here
  ]

  return (
    <div>
      <WordTable words={words} />
      <AddButton/>
    </div>
  );
};

export default Dashboard;
