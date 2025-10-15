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
  setAutoTopic
}) {
  return (
    <>
      <div className="flex p-2 border-r shadow-xl mb-4 w-full">
        <div className="flex basis-1/6 items-center justify-start">
          <p className="text-xl font-semibold">⚙️ Settings</p>
        </div>
        <div className="flex basis-2/6 items-center justify-end space-x-3">
          <label className="basis-1/3 text-end text-sm font-medium">🎭 Writing Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="border p-2 rounded basis-2/3"
          >
            <option>Professional</option>
            <option>Casual</option>
            <option>Persuasive</option>
            <option>Informative</option>
            <option>Enthusiastic</option>
          </select>
        </div>
        <div className="flex basis-2/6 items-center justify-between space-x-3">
          <label className="basis-1/3 text-sm font-medium text-end">📏 Word Count: {wordTarget}</label>
          <input
            type="range"
            min="300"
            max="2000"
            step="100"
            value={wordTarget}
            onChange={(e) => setWordTarget(e.target.value)}
            className="basis-2/3"
          />
        </div>
        <div className="flex basis-1/6 items-center justify-end space-x-3">
          <label className="basis-1/2 text-sm font-medium text-end">🤖 Auto Topic</label>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoTopic ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            onClick={() => setAutoTopic(!autoTopic)}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoTopic ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
          </button>
        </div>
      </div>
      <div className="mx-3">
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
            🤖 <strong>Auto Topic Mode:</strong> The system will automatically choose and generate the best topic based on current trends.
          </p>
        </div>
      )}
    </>
  );
}