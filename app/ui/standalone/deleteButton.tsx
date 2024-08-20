import React from 'react';
import { Button } from '@/components/ui/button';

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, disabled }) => {
  return (
    <div className="mt-4 flex justify-center sticky bottom-2">
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`px-2 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 text-xs ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Delete selected
      </Button>
    </div>
  );
};

export default DeleteButton;