// src/components/ModernSearchBar.tsx
import { useState, useRef, useEffect } from "react";
import { Search, Loader2, X, Command } from "lucide-react";

interface Props {
  onSearch: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function ModernSearchBar({ 
  onSearch, 
  isLoading, 
  placeholder = "Search ENS or Address (e.g. jesse.base.eth)" 
}: Props) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fitur tambahan: Keyboard Shortcut (Ctrl/Cmd + K) untuk fokus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSearch(input.trim());
    }
  };

  const handleClear = () => {
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-lg mx-auto relative group mb-8">
      {/* Glow Effect di belakang (Opsional, untuk vibes Web3) */}
      <div 
        className={`absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 transition duration-500 group-hover:opacity-40 ${
          isFocused ? "opacity-60 blur-md" : ""
        }`} 
      />

      <form 
        onSubmit={handleSubmit} 
        className={`relative flex items-center bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-xl p-2 transition-all duration-300 ${
          isFocused ? "border-blue-500/50 shadow-lg shadow-blue-500/10" : "hover:border-slate-700"
        }`}
      >
        {/* Search Icon */}
        <div className="pl-3 pr-2 text-slate-500">
          <Search className={`w-5 h-5 transition-colors ${isFocused ? "text-blue-400" : ""}`} />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 bg-transparent text-slate-200 placeholder:text-slate-600 focus:outline-none text-sm font-medium py-2.5"
        />

        {/* Right Actions Area */}
        <div className="flex items-center gap-2 pr-2">
          
          {/* Clear Button (Muncul jika ada text & tidak loading) */}
          {input && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-500 hover:text-slate-300 transition-colors rounded-full hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Keyboard Shortcut Hint (Sembunyikan jika ada text atau focused) */}
          {!input && !isFocused && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs text-slate-500 select-none">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}

          {/* Submit / Loading Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`
              flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${isLoading 
                ? "bg-slate-800 text-slate-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-800"}
            `}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Check"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
