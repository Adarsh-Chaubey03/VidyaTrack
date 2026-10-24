import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ data = '', inputClassName = '', textColor = 'text-white', className = '' }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data);

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate('/course-list/' + input.trim());
    }
  };

  return (
    <form onSubmit={onSearchHandler} className={`w-full max-w-md mx-auto relative group ${className}`}>
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search for courses, topics, or..."
        className={`${textColor} w-full pl-5 pr-14 py-3 text-sm sm:text-base rounded-full border border-white/20 bg-white/10 backdrop-blur-sm shadow-lg shadow-black/10 placeholder:text-gray-300/80 transition-all duration-200 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:bg-white/[0.14] hover:bg-white/[0.12] ${inputClassName}`}
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-150 active:scale-95"
        aria-label="Search"
      >
        <Search size={16} strokeWidth={2.5} />
      </button>
    </form>
  );
};

export default SearchBar;
