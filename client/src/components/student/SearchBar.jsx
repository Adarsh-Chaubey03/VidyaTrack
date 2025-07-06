import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ data = '', inputClassName = '', textColor = 'text-white' }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data);

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate('/course-list/' + input.trim());
    }
  };

  return (
    <form onSubmit={onSearchHandler} className="w-full max-w-4xl mx-auto mt-10 relative">
      <input 
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search for courses, topics, or educators..."
        className={`${textColor} w-full px-8 py-3 pr-20 text-xl rounded-full border-2 border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent placeholder:text-gray-200 transition ${inputClassName}`}
      />
      <button type="submit">
        <Search
          size={24}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-300"
        />
      </button>
    </form>
  );
};

export default SearchBar;
