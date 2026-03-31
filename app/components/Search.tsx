"use client";

import { useState } from "react";

interface SearchProps {
  onSearch: (query: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
  const [query, setQuery] = useState<string>("");

  function handleSubmit() {
    const title = query.trim();
    if (title === "") return;
    onSearch(title);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex w-full"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a Movie Title..."
        className="flex-1 bg-second text-white px-5 py-3 rounded-l-full outline-none"
      />
      <button
        type="submit"
        className="cursor-pointer font-bold bg-third text-white px-6 py-3 rounded-r-full"
      >
        Search
      </button>
    </form>
  );
}
