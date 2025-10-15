// export default function BlogViewer({ blog }) {
//   if (!blog) return null;

//   const content = blog.blog_content;

//   return (
//     <div className="mt-6 p-4 border rounded bg-gray-50">
//       <h2 className="text-2xl font-bold">{content?.title}</h2>
//       <p className="italic">{content?.subtitle}</p>

//       {content?.body?.map((sec, i) => (
//         <div key={i} className="mt-3">
//           <h3 className="font-semibold">{sec.heading}</h3>
//           <p>{sec.content}</p>
//         </div>
//       ))}

//       {blog.docx_file && (
//         <a
//           href={`http://localhost:8000/${blog.docx_file}`}
//           download
//           className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded"
//         >
//           📥 Download DOCX
//         </a>
//       )}
//     </div>
//   );
// }

// import { useState } from "react";

// export default function BlogViewer({ blog }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedContent, setEditedContent] = useState(null);

//   if (!blog) return null;

//   // Initialize edited content when blog changes
//   if (!editedContent && blog.blog_content) {
//     setEditedContent(JSON.parse(JSON.stringify(blog.blog_content)));
//   }

//   const content = isEditing ? editedContent : blog.blog_content;

//   const handleEditToggle = () => {
//     if (isEditing) {
//       // Save changes when turning off edit mode
//       console.log("Saving changes:", editedContent);
//       // You can add an API call here to save the edited content
//     } else {
//       // Enter edit mode - reset to original content
//       setEditedContent(JSON.parse(JSON.stringify(blog.blog_content)));
//     }
//     setIsEditing(!isEditing);
//   };

//   const handleTitleChange = (value) => {
//     setEditedContent(prev => ({ ...prev, title: value }));
//   };

//   const handleSubtitleChange = (value) => {
//     setEditedContent(prev => ({ ...prev, subtitle: value }));
//   };

//   const handleSectionHeadingChange = (index, value) => {
//     setEditedContent(prev => ({
//       ...prev,
//       body: prev.body.map((section, i) =>
//         i === index ? { ...section, heading: value } : section
//       )
//     }));
//   };

//   const handleSectionContentChange = (index, value) => {
//     setEditedContent(prev => ({
//       ...prev,
//       body: prev.body.map((section, i) =>
//         i === index ? { ...section, content: value } : section
//       )
//     }));
//   };

//   const handleConclusionChange = (value) => {
//     setEditedContent(prev => ({ ...prev, conclusion: value }));
//   };

//   const handleTagsChange = (value) => {
//     setEditedContent(prev => ({
//       ...prev,
//       tags: value.split(',').map(tag => tag.trim()).filter(tag => tag)
//     }));
//   };

//   const addNewSection = () => {
//     setEditedContent(prev => ({
//       ...prev,
//       body: [...prev.body, { heading: "New Section", content: "" }]
//     }));
//   };

//   const removeSection = (index) => {
//     setEditedContent(prev => ({
//       ...prev,
//       body: prev.body.filter((_, i) => i !== index)
//     }));
//   };

//   const downloadEditedDocx = async () => {
//     try {
//       const response = await fetch(`${API_URL}/generate-docx`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ blog_content: editedContent }),
//       });

//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `${editedContent.title.replace(/ /g, "_")}_edited.docx`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//       }
//     } catch (error) {
//       console.error("Download failed:", error);
//       alert("Failed to download edited document");
//     }
//   };

//   return (
//     <div className="mt-6 p-6 border rounded bg-white shadow-sm">
//       {/* Header with Edit Toggle */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">📝 Blog Content</h2>
//         <div className="flex space-x-2">
//           {isEditing && (
//             <button
//               onClick={downloadEditedDocx}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               💾 Save & Download DOCX
//             </button>
//           )}
//           <button
//             onClick={handleEditToggle}
//             className={`px-4 py-2 rounded ${isEditing
//                 ? "bg-gray-600 text-white hover:bg-gray-700"
//                 : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//           >
//             {isEditing ? "✖️ Cancel" : "✏️ Edit Content"}
//           </button>
//         </div>
//       </div>

//       {/* Title */}
//       <div className="mb-6">
//         {isEditing ? (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
//             <input
//               type="text"
//               value={content?.title || ""}
//               onChange={(e) => handleTitleChange(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg text-2xl font-bold"
//               placeholder="Blog title..."
//             />
//           </div>
//         ) : (
//           <h2 className="text-2xl font-bold text-gray-900">{content?.title}</h2>
//         )}
//       </div>

//       {/* Subtitle */}
//       <div className="mb-6">
//         {isEditing ? (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
//             <input
//               type="text"
//               value={content?.subtitle || ""}
//               onChange={(e) => handleSubtitleChange(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg italic"
//               placeholder="Blog subtitle..."
//             />
//           </div>
//         ) : (
//           <p className="italic text-gray-600 text-lg">{content?.subtitle}</p>
//         )}
//       </div>

//       {/* Blog Sections */}
//       {content?.body?.map((section, index) => (
//         <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
//           <div className="flex justify-between items-start mb-3">
//             {isEditing ? (
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Section Heading {index + 1}
//                 </label>
//                 <input
//                   type="text"
//                   value={section.heading || ""}
//                   onChange={(e) => handleSectionHeadingChange(index, e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded font-semibold"
//                   placeholder="Section heading..."
//                 />
//               </div>
//             ) : (
//               <h3 className="text-xl font-semibold text-gray-800">{section.heading}</h3>
//             )}

//             {isEditing && (
//               <button
//                 onClick={() => removeSection(index)}
//                 className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
//               >
//                 🗑️
//               </button>
//             )}
//           </div>

//           {isEditing ? (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
//               <textarea
//                 value={section.content || ""}
//                 onChange={(e) => handleSectionContentChange(index, e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]"
//                 placeholder="Section content..."
//               />
//             </div>
//           ) : (
//             <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
//           )}
//         </div>
//       ))}

//       {/* Add New Section Button */}
//       {isEditing && (
//         <button
//           onClick={addNewSection}
//           className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           ➕ Add New Section
//         </button>
//       )}

//       {/* Conclusion */}
//       {content?.conclusion && (
//         <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
//           <h3 className="font-semibold text-gray-800 mb-2">Conclusion</h3>
//           {isEditing ? (
//             <textarea
//               value={content.conclusion || ""}
//               onChange={(e) => handleConclusionChange(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px]"
//               placeholder="Conclusion..."
//             />
//           ) : (
//             <p className="text-gray-700">{content.conclusion}</p>
//           )}
//         </div>
//       )}

//       {/* Tags */}
//       {content?.tags && content.tags.length > 0 && (
//         <div className="mb-6">
//           <h3 className="font-semibold text-gray-800 mb-2">Tags</h3>
//           {isEditing ? (
//             <input
//               type="text"
//               value={content.tags.join(", ")}
//               onChange={(e) => handleTagsChange(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Separate tags with commas..."
//             />
//           ) : (
//             <div className="flex flex-wrap gap-2">
//               {content.tags.map((tag, index) => (
//                 <span
//                   key={index}
//                   className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
//                 >
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Download Original Button */}
//       {!isEditing && blog.docx_file && (
//         <div className="mt-6 pt-4 border-t">
//           <a
//             href={`http://localhost:8000/${blog.docx_file}`}
//             download
//             className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
//           >
//             📥 Download Original DOCX
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";

const API_URL = "http://localhost:8000"; // adjust if needed

export default function BlogViewer({ blog }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null); // loader for section AI generation
  const [headingErrors, setHeadingErrors] = useState({}); // store per-section heading errors

  if (!blog) return null;

  // Initialize edited content when blog changes
  if (!editedContent && blog.blog_content) {
    setEditedContent(JSON.parse(JSON.stringify(blog.blog_content)));
  }

  // useEffect(() => {
  //   if (blog?.blog_content) {
  //     setEditedContent(JSON.parse(JSON.stringify(blog.blog_content)));
  //   }
  // }, [blog]);


  const content = isEditing ? editedContent : blog.blog_content;

  const handleEditToggle = () => {
    if (isEditing) {
      console.log("Saving changes:", editedContent);
      // Add API call to save edited content if needed
    } else {
      setEditedContent(JSON.parse(JSON.stringify(blog.blog_content)));
    }
    setIsEditing(!isEditing);
  };

  const handleTitleChange = (value) => {
    setEditedContent((prev) => ({ ...prev, title: value }));
  };

  const handleSubtitleChange = (value) => {
    setEditedContent((prev) => ({ ...prev, subtitle: value }));
  };

  // ✅ Handle section heading change with validation
  const handleSectionHeadingChange = (index, value) => {
    setEditedContent((prev) => ({
      ...prev,
      body: prev.body.map((section, i) =>
        i === index ? { ...section, heading: value } : section
      ),
    }));

    // Validate heading name
    if (value.trim().toLowerCase() === "new section") {
      setHeadingErrors((prev) => ({
        ...prev,
        [index]: "Please write a proper heading instead of 'New Section'.",
      }));
    } else if (value.trim() === "") {
      setHeadingErrors((prev) => ({
        ...prev,
        [index]: "Heading cannot be empty.",
      }));
    } else {
      setHeadingErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const handleSectionContentChange = (index, value) => {
    setEditedContent((prev) => ({
      ...prev,
      body: prev.body.map((section, i) =>
        i === index ? { ...section, content: value } : section
      ),
    }));
  };

  const handleConclusionChange = (value) => {
    setEditedContent((prev) => ({ ...prev, conclusion: value }));
  };

  const handleTagsChange = (value) => {
    setEditedContent((prev) => ({
      ...prev,
      tags: value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    }));
  };

  const addNewSection = () => {
    setEditedContent((prev) => ({
      ...prev,
      body: [...prev.body, { heading: "New Section", content: "" }],
    }));
  };

  const removeSection = (index) => {
    setEditedContent((prev) => ({
      ...prev,
      body: prev.body.filter((_, i) => i !== index),
    }));

    setHeadingErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  // 🔥 AI Generate Section Content
  const handleAIGenerate = async (index) => {
    const section = editedContent.body[index];
    if (
      !section.heading.trim() ||
      section.heading.trim().toLowerCase() === "new section"
    ) {
      alert("Please write a proper heading before generating AI content.");
      return;
    }

    setLoadingIndex(index);
    try {
      const response = await fetch(`${API_URL}/refresh-section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedContent.title,
          existing_body: editedContent.body,
          new_heading: section.heading,
        }),
      });

      if (!response.ok) throw new Error("AI generation failed");
      const data = await response.json();

      setEditedContent((prev) => ({
        ...prev,
        body: prev.body.map((s, i) =>
          i === index ? { ...s, content: data.generated_content } : s
        ),
      }));
    } catch (err) {
      alert("AI generation failed. Please try again.");
      console.error(err);
    } finally {
      setLoadingIndex(null);
    }
  };

  // Download Edited DOCX
  const downloadEditedDocx = async () => {
    try {
      const response = await fetch(`${API_URL}/generate-docx`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blog_content: editedContent }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${editedContent.title.replace(/ /g, "_")}_edited.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download edited document");
    }
  };

  return (
    <div className="mt-6 p-6 border rounded bg-white shadow-sm">
      {/* Header with Edit Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📝 Blog Content</h2>
        <div className="flex space-x-2">
          {isEditing && (
            <button
              onClick={downloadEditedDocx}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              💾 Save & Download DOCX
            </button>
          )}
          <button
            onClick={handleEditToggle}
            className={`px-4 py-2 rounded ${isEditing
              ? "bg-gray-600 text-white hover:bg-gray-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {isEditing ? "✖️ Cancel" : "✏️ Edit Content"}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        {isEditing ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={content?.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-2xl font-bold"
              placeholder="Blog title..."
            />
          </div>
        ) : (
          <h2 className="text-2xl font-bold text-gray-900">{content?.title}</h2>
        )}
      </div>

      {/* Subtitle */}
      <div className="mb-6">
        {isEditing ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={content?.subtitle || ""}
              onChange={(e) => handleSubtitleChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg italic"
              placeholder="Blog subtitle..."
            />
          </div>
        ) : (
          <p className="italic text-gray-600 text-lg">{content?.subtitle}</p>
        )}
      </div>

      {/* Blog Sections */}
      {content?.body?.map((section, index) => (
        <div
          key={index}
          className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
        >
          <div className="flex justify-between items-start mb-3">
            {isEditing ? (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Heading {index + 1}
                </label>
                <input
                  type="text"
                  value={section.heading || ""}
                  onChange={(e) =>
                    handleSectionHeadingChange(index, e.target.value)
                  }
                  className={`w-full p-2 border rounded font-semibold ${headingErrors[index]
                    ? "border-red-500"
                    : "border-gray-300"
                    }`}
                  placeholder="Section heading..."
                />
                {headingErrors[index] && (
                  <p className="text-sm text-red-500 mt-1">
                    {headingErrors[index]}
                  </p>
                )}
              </div>
            ) : (
              <h3 className="text-xl font-semibold text-gray-800">
                {section.heading}
              </h3>
            )}

            {isEditing && (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  disabled={
                    loadingIndex === index || !!headingErrors[index]
                  }
                  onClick={() => handleAIGenerate(index)}
                  className={`${loadingIndex === index || headingErrors[index]
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white px-3 py-1 rounded text-sm`}
                >
                  {loadingIndex === index
                    ? "⏳ Generating..."
                    : "✨ Generate with AI"}
                </button>

                <button
                  onClick={() => removeSection(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={section.content || ""}
                onChange={(e) =>
                  handleSectionContentChange(index, e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]"
                placeholder="Section content..."
              />
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {section.content}
            </p>
          )}
        </div>
      ))}

      {/* Add New Section Button */}
      {isEditing && (
        <button
          onClick={addNewSection}
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ➕ Add New Section
        </button>
      )}

      {/* Conclusion */}
      {content?.conclusion && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
          <h3 className="font-semibold text-gray-800 mb-2">Conclusion</h3>
          {isEditing ? (
            <textarea
              value={content.conclusion || ""}
              onChange={(e) => handleConclusionChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px]"
              placeholder="Conclusion..."
            />
          ) : (
            <p className="text-gray-700">{content.conclusion}</p>
          )}
        </div>
      )}

      {/* Tags */}
      {content?.tags && content.tags.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Tags</h3>
          {isEditing ? (
            <input
              type="text"
              value={content.tags.join(", ")}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Separate tags with commas..."
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Download Original Button */}
      {!isEditing && blog.docx_file && (
        <div className="mt-6 pt-4 border-t">
          <a
            href={`${API_URL}/${blog.docx_file}`}
            download
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            📥 Download Original DOCX
          </a>
        </div>
      )}
    </div>
  );
}
