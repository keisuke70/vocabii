import AddButton from '@/app/ui/standalone/addButton';
import WordTable from '@/app/ui/dashboard/wordbook/wordTable';
import { fetchWord } from '@/lib/data';

const Dashboard: React.FC = async() => {
  const fetchedWords = await fetchWord();
  return (
    <div className='bg-transparent'>
      <WordTable initialWords={fetchedWords} />
      <AddButton/>
    </div>
  );
};

export default Dashboard;
