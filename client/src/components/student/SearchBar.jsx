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
    <form onSubmit={onSearchHandler} className="w-full max-w-2xl mx-auto mt-8 relative group">
      <input 
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search for courses, topics, or educators..."
        className={`${textColor} w-full pl-6 pr-14 py-3.5 text-base sm:text-lg rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-lg shadow-black/10 placeholder:text-gray-300 transition-all duration-300 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/30 focus:bg-white/[0.14] hover:border-white/30 hover:bg-white/[0.12] ${inputClassName}`}
      />
      <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 text-white transition-all duration-200 active:scale-95">
        <Search size={18} strokeWidth={2.5} />
      </button>
    </form>
  );
};

export default SearchBar;
