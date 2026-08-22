'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface ExploreSearchProps {
  onSearch?: (value: string) => void;
}

export default function ExploreSearch({ onSearch }: ExploreSearchProps) {
  const [value, setValue] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setValue(value);
    onSearch?.(value);
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Ketik judul campaign..."
        value={value}
        onChange={handleChange}
        className="neo-card w-full bg-white py-3 pl-11 pr-4 font-bold text-black placeholder:font-medium placeholder:text-gray-400 focus:outline-none"
      />

      <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 stroke-3 text-black" />
    </div>
  );
}
