// src/components/SearchBar.tsx
import { useState } from "react";
import { Search } from "lucide-react";

interface Props {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onSearch(input);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md relative mb-6">
      <input
        type="text"
        placeholder="Search (e.g., jesse.base.eth or 0x...)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-full py-3 px-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
      <button 
        type="submit" 
        disabled={isLoading}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-full font-bold transition disabled:opacity-50"
      >
        {isLoading ? "..." : "Check"}
      </button>
    </form>
  );
}
