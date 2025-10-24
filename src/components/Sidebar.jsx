import { useState } from "react";

export default function Sidebar({
  query,
  setQuery,
  tone,
  setTone,
  wordTarget,
  setWordTarget,
  onSearch,
  loading,
  autoTopic,
  setAutoTopic,
  linkedIn,
  setLinkedIn,
  instagram,
  setInstagram,
  medium,
  setMedium
}) {
  // const toggleAll = () => {
  //   const newState = !(linkedIn && instagram && medium);
  //   setLinkedIn(newState);
  //   setInstagram(newState);
  //   setMedium(newState);
  // };
  const toggleAll = () => {
    const newState = !(linkedIn && instagram);
    setLinkedIn(newState);
    setInstagram(newState);
  };

  return (
    <>
      {/* Single-line Top Container */}
      <div className="flex items-center px-4 py-2 border-r shadow-xl mb-4 space-x-14 overflow-x-auto">
        {/* Header */}
        {/* <p className="text-xl font-semibold whitespace-nowrap">⚙️ Settings</p> */}

        {/* Tone */}
        <div className="flex items-center space-x-1 whitespace-nowrap">
          <label className="text-sm font-medium">🎭 Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="border p-1 rounded"
          >
            <option>Professional</option>
            <option>Casual</option>
            <option>Persuasive</option>
            <option>Informative</option>
            <option>Enthusiastic</option>
          </select>
        </div>

        {/* Word Count */}
        <div className="flex items-center space-x-1 whitespace-nowrap">
          <label className="text-sm font-medium">Blog Word Limit {wordTarget}</label>
          <input
            type="range"
            min="700"
            max="2000"
            step="50"
            value={wordTarget}
            onChange={(e) => setWordTarget(e.target.value)}
            className="w-32"
          />
        </div>

        {/* Auto Topic */}
        {/* <div className="flex items-center space-x-1 whitespace-nowrap">
          <label className="text-sm font-medium">🤖 Auto Choice</label>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${autoTopic ? "bg-blue-600" : "bg-gray-200"
              }`}
            onClick={() => setAutoTopic(!autoTopic)}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${autoTopic ? "translate-x-5" : "translate-x-0"
                }`}
            />
          </button>
        </div> */}

        {/* LinkedIn */}
        <div className="flex items-center space-x-1 whitespace-nowrap">
          <label className="text-sm font-medium">🔗 LinkedIn</label>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${linkedIn ? "bg-blue-700" : "bg-gray-200"
              }`}
            onClick={() => setLinkedIn(!linkedIn)}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${linkedIn ? "translate-x-5" : "translate-x-0"
                }`}
            />
          </button>
        </div>

        {/* Instagram */}
        <div className="flex items-center space-x-1 whitespace-nowrap">
          <label className="text-sm font-medium">📸 Instagram</label>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${instagram ? "bg-pink-500" : "bg-gray-200"
              }`}
            onClick={() => setInstagram(!instagram)}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${instagram ? "translate-x-5" : "translate-x-0"
                }`}
            />
          </button>
        </div>

        {/* Medium */}
        <div className="flex items-center space-x-1 whitespace-nowrap">
          <label className="text-sm font-medium">✍️ Medium</label>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${medium ? "bg-gray-800" : "bg-gray-200"
              }`}
            onClick={() => setMedium(!medium)}
            disabled
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${medium ? "translate-x-5" : "translate-x-0"
                }`}
            />
          </button>
        </div>
        {/* Toggle All */}
        <div className="flex items-center space-x-1 whitespace-nowrap">
          <label className="text-sm font-medium">🪄 Switch All</label>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${linkedIn && instagram && medium ? "bg-green-600" : "bg-gray-200"
              }`}
            onClick={toggleAll}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${linkedIn && instagram && medium ? "translate-x-5" : "translate-x-0"
                }`}
            />
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="mx-3 mt-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded mb-3 w-full"
          placeholder="Enter search query"
          disabled={autoTopic}
        />
        <button
          onClick={onSearch}
          disabled={loading}
          className="bg-blue-600 text-white items-center justify-center px-4 py-2 rounded w-1/4"
        >
          {loading ? "Searching..." : "🔍 Search Topics"}
        </button>
      </div>

      {autoTopic && (
        <div className="p-1 mx-3">
          <p className="text-sm text-blue-800">
            🤖 <strong>Auto Topic Mode:</strong> The system will automatically choose and
            generate the best topic based on current trends.
          </p>
        </div>
      )}
    </>
  );
}
