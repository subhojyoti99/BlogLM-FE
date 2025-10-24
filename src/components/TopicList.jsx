// import { useState } from "react";

// export default function TopicList({
//   topics,
//   selectedTopics,
//   setSelectedTopics,
//   onGenerate,
//   autoTopic,
// }) {
//   const [loading, setLoading] = useState(false);

//   const toggleSelection = (i) => {
//     setSelectedTopics((prev) =>
//       prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
//     );
//   };

//   const handleGenerate = async () => {
//     try {
//       setLoading(true);
//       await onGenerate(); // Wait for blog generation
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mt-6">
//         🔍 Found Topics ({topics.length})
//       </h2>

//       {autoTopic ? (
//         <></>
//       ) : (
//         <>
//           <ul>
//             {topics.map((t, i) => (
//               <li
//                 key={i}
//                 onClick={() => toggleSelection(i)}
//                 className={`p-3 border rounded mb-2 cursor-pointer transition ${selectedTopics.includes(i)
//                     ? "bg-blue-100 border-blue-500"
//                     : "bg-gray-50 hover:bg-gray-100"
//                   }`}
//               >
//                 <b>{t.title}</b>
//                 <br />
//                 <a
//                   href={t.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-sm text-blue-600"
//                 >
//                   {t.url}
//                 </a>
//               </li>
//             ))}
//           </ul>

//           {selectedTopics.length > 0 && (
//             <button
//               onClick={handleGenerate}
//               disabled={loading}
//               className={`bg-green-600 text-white px-4 py-2 rounded mt-4 flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""
//                 }`}
//             >
//               {loading ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
//                     ></path>
//                   </svg>
//                   <span>Generating...</span>
//                 </>
//               ) : (
//                 <>
//                   🚀 Generate Blog{selectedTopics.length > 1 && "s"}
//                 </>
//               )}
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
  loading,
}) {
  const [generating, setGenerating] = useState(false);

  const toggleSelection = (i) => {
    setSelectedTopics((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await onGenerate(); // Wait for blog generation
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mt-6">
        🔍 Found Topics ({topics.length})
      </h2>

      {autoTopic ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm">
            Auto-blog generation in progress... Topics will be automatically selected.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {topics.map((t, i) => (
              <li
                key={i}
                onClick={() => toggleSelection(i)}
                className={`p-3 border rounded cursor-pointer transition ${selectedTopics.includes(i)
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
                  className="text-sm text-blue-600 break-all"
                >
                  {t.url}
                </a>
              </li>
            ))}
          </ul>

          {selectedTopics.length > 0 && (
            <button
              onClick={handleGenerate}
              disabled={generating || loading}
              className={`bg-green-600 text-white px-4 py-2 rounded mt-4 flex items-center justify-center gap-2 ${generating || loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
            >
              {(generating || loading) ? (
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
                  <span>Generating Blog{selectedTopics.length > 1 && "s"}...</span>
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