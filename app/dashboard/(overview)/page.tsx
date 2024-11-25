import AddButton from "@/app/ui/standalone/addButton";
import WordTable from "@/app/ui/dashboard/wordbook/wordTable";
import { fetchWord, hasActiveSubscription } from "@/lib/data";
import { FaExclamationTriangle } from "react-icons/fa";

const Dashboard: React.FC = async () => {
  const fetchedWords = await fetchWord();
  const isSubscribed = await hasActiveSubscription();

  return (
    <div>
      <h1 className="mb-3 text-xl md:text-3xl font-bold mt-2 bg-gradient-to-r from-sky-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
        Your WordTable
      </h1>
      {fetchedWords.length > 0 ? (
        <WordTable initialWords={fetchedWords} isSubscribed ={isSubscribed}/>
      ) : (
        <h2 className="text-sm md:text-xl font-semibold text-center flex flex-col items-center justify-center space-y-2 mt-8 mb-6">
          <div className="flex items-center space-x-2">
            <FaExclamationTriangle className="text-xl md:text-2xl text-yellow-500" />
            <span className="text-gray-600">
              No words found in your WordTable.
            </span>
          </div>
          <span className="text-lg md:text-xl font-bold  bg-gradient-to-r from-sky-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
            Start building your vocabulary by adding new words using the button
            below.
          </span>
        </h2>
      )}
      <AddButton />
    </div>
  );
};

export default Dashboard;
