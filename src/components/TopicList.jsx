// export default function TopicList({
//   topics,
//   mode,
//   setMode,
//   selectedTopics,
//   setSelectedTopics,
//   onGenerate,
//   autoTopic
// }) {
//   const toggleSelection = (i) => {
//     if (mode === "single") {
//       setSelectedTopics([i]);
//     } else {
//       setSelectedTopics((prev) =>
//         prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
//       );
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mt-6">🔍 Found Topics ({topics.length})</h2>

//       {autoTopic ? (
//         // <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
//         //   <div className="flex items-center justify-center space-x-2">
//         //     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//         //     <p className="text-blue-700 font-medium">🤖 Auto-selecting and generating the best topic...</p>
//         //   </div>
//         // </div>
//         <>
//         </>
//       ) : (
//         <>
//           <div className="flex space-x-4 my-2">
//             <button
//               onClick={() => setMode("single")}
//               className={`px-3 py-1 rounded ${mode === "single" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//             >
//               🎯 Single
//             </button>
//             <button
//               onClick={() => setMode("blended")}
//               className={`px-3 py-1 rounded ${mode === "blended" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//             >
//               🔄 Blended
//             </button>
//           </div>

//           <ul>
//             {topics.map((t, i) => (
//               <li
//                 key={i}
//                 onClick={() => toggleSelection(i)}
//                 className={`p-3 border rounded mb-2 cursor-pointer ${selectedTopics.includes(i) ? "bg-blue-100 border-blue-500" : "bg-gray-50"
//                   }`}
//               >
//                 <b>{t.title}</b> <br />
//                 <a href={t.url} target="_blank" className="text-sm text-blue-600">
//                   {t.url}
//                 </a>
//               </li>
//             ))}
//           </ul>

//           {selectedTopics.length > 0 && (
//             <button
//               onClick={onGenerate}
//               className="bg-green-600 text-white px-4 py-2 rounded mt-4"
//             >
//               {mode === "single" ? "🚀 Generate Blog" : "🔄 Generate Blended Blog"}
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

import { useState } from "react";

export default function TopicList({
  topics,
  selectedTopics,
  setSelectedTopics,
  onGenerate,
  autoTopic,
}) {
  const [loading, setLoading] = useState(false);

  const toggleSelection = (i) => {
    setSelectedTopics((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await onGenerate(); // Wait for blog generation
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mt-6">
        🔍 Found Topics ({topics.length})
      </h2>

      {autoTopic ? (
        <></>
      ) : (
        <>
          <ul>
            {topics.map((t, i) => (
              <li
                key={i}
                onClick={() => toggleSelection(i)}
                className={`p-3 border rounded mb-2 cursor-pointer transition ${selectedTopics.includes(i)
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                <b>{t.title}</b>
                <br />
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600"
                >
                  {t.url}
                </a>
              </li>
            ))}
          </ul>

          {selectedTopics.length > 0 && (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`bg-green-600 text-white px-4 py-2 rounded mt-4 flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  🚀 Generate Blog{selectedTopics.length > 1 && "s"}
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
