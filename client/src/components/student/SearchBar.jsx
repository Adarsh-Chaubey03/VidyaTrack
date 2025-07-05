import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ data = '', inputClassName = '' }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data);

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate('/course-list/' + input.trim());
    }
  };

  return (
    <form onSubmit={onSearchHandler} className="w-full max-w-2xl mx-auto mt-10 relative">
      <input 
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search for courses, topics, or educators..."
        className={`w-full px-6 py-4 pr-14 text-xl rounded-full border border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-200 transition ${inputClassName}`}
      />
      <button type="submit">
        <Search
          size={24}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white dark:text-gray-300"
        />
      </button>
    </form>
  );
};

export default SearchBar;
