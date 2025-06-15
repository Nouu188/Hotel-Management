"use client";

import React from 'react'
import { Button } from '../../ui/button';

interface AddAndRemoveExtraProps {
  isAdded: boolean; 
  onAdd: () => void;
  onRemove: () => void;
}

const AddAndRemoveExtra = ({ isAdded, onAdd, onRemove }: AddAndRemoveExtraProps) => {
  if (isAdded) {
    return (
      <Button 
        onClick={onRemove} 
        variant="ghost"
        className='py-2 px-6 h-auto border-1 text-[#066A92] border-[#066A92] hover:text-white hover:bg-[#055a7a] rounded-sm text-sm'
      >
        Remove
      </Button>
    );
  }

  return (
    <Button 
        onClick={onAdd} 
        variant="ghost"
        className='py-2 px-6 h-auto border-1 text-[#066A92] border-[#066A92] hover:bg-[#055a7a] hover:text-white rounded-sm text-sm flex items-center gap-2'
    >
        Add
    </Button>
  );
}

export default AddAndRemoveExtra;
