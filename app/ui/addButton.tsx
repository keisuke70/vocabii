import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AddButton: React.FC = () => {
  return (
    <div className="mt-4 flex justify-center">
      <Link href="/dashboard/add" passHref>
        <Button className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-md hover:bg-teal-700">
          Add Word
        </Button>
      </Link>
    </div>
  );
};

export default AddButton;