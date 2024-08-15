import AddButton from '../ui/standalone/addButton';
import WordTable from '../ui/dashboard/wordbook/wordTable';
import { fetchWord } from '@/lib/data';

const Dashboard: React.FC = async() => {
  const fetchedWords = await fetchWord();
  return (
    <div>
      <WordTable words={fetchedWords} />
      <AddButton/>
    </div>
  );
};

export default Dashboard;
