// import { useState } from "react";

// const API_URL = "http://localhost:8000"; // adjust if needed

// export default function BlogViewer({ blog }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedContent, setEditedContent] = useState(null);
//   const [loadingIndex, setLoadingIndex] = useState(null); // loader for section AI generation
//   const [headingErrors, setHeadingErrors] = useState({}); // store per-section heading errors

//   if (!blog) return null;

//   // Initialize edited content when blog changes
//   if (!editedContent && blog.blog_content) {
//     setEditedContent(JSON.parse(JSON.stringify(blog.blog_content)));
//   }

//   // useEffect(() => {
//   //   if (blog?.blog_content) {
//   //     setEditedContent(JSON.parse(JSON.stringify(blog.blog_content)));
//   //   }
//   // }, [blog]);


//   const content = isEditing ? editedContent : blog.blog_content;

//   const handleEditToggle = () => {
//     if (isEditing) {
//       console.log("Saving changes:", editedContent);
//       // Add API call to save edited content if needed
//     } else {
//       setEditedContent(JSON.parse(JSON.stringify(blog.blog_content)));
//     }
//     setIsEditing(!isEditing);
//   };

//   const handleTitleChange = (value) => {
//     setEditedContent((prev) => ({ ...prev, title: value }));
//   };

//   const handleSubtitleChange = (value) => {
//     setEditedContent((prev) => ({ ...prev, subtitle: value }));
//   };

//   // ✅ Handle section heading change with validation
//   const handleSectionHeadingChange = (index, value) => {
//     setEditedContent((prev) => ({
//       ...prev,
//       body: prev.body.map((section, i) =>
//         i === index ? { ...section, heading: value } : section
//       ),
//     }));

//     // Validate heading name
//     if (value.trim().toLowerCase() === "new section") {
//       setHeadingErrors((prev) => ({
//         ...prev,
//         [index]: "Please write a proper heading instead of 'New Section'.",
//       }));
//     } else if (value.trim() === "") {
//       setHeadingErrors((prev) => ({
//         ...prev,
//         [index]: "Heading cannot be empty.",
//       }));
//     } else {
//       setHeadingErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[index];
//         return newErrors;
//       });
//     }
//   };

//   const handleSectionContentChange = (index, value) => {
//     setEditedContent((prev) => ({
//       ...prev,
//       body: prev.body.map((section, i) =>
//         i === index ? { ...section, content: value } : section
//       ),
//     }));
//   };

//   const handleConclusionChange = (value) => {
//     setEditedContent((prev) => ({ ...prev, conclusion: value }));
//   };

//   const handleTagsChange = (value) => {
//     setEditedContent((prev) => ({
//       ...prev,
//       tags: value
//         .split(",")
//         .map((tag) => tag.trim())
//         .filter((tag) => tag),
//     }));
//   };

//   const addNewSection = () => {
//     setEditedContent((prev) => ({
//       ...prev,
//       body: [...prev.body, { heading: "New Section", content: "" }],
//     }));
//   };

//   const removeSection = (index) => {
//     setEditedContent((prev) => ({
//       ...prev,
//       body: prev.body.filter((_, i) => i !== index),
//     }));

//     setHeadingErrors((prev) => {
//       const newErrors = { ...prev };
//       delete newErrors[index];
//       return newErrors;
//     });
//   };

//   // 🔥 AI Generate Section Content
//   const handleAIGenerate = async (index) => {
//     const section = editedContent.body[index];
//     const heading = Array.isArray(section.headings)
//       ? section.headings[0]
//       : section.heading;

//     if (!heading || heading.trim().toLowerCase() === "new section") {
//       alert("Please write a proper heading before generating AI content.");
//       return;
//     }

//     setLoadingIndex(index);
//     try {
//       const response = await fetch(`${API_URL}/refresh-section`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title: editedContent.title,
//           existing_body: editedContent.body,
//           new_heading: heading
//         }),
//       });

//       if (!response.ok) throw new Error("AI generation failed");
//       const data = await response.json();

//       setEditedContent(prev => ({
//         ...prev,
//         body: prev.body.map((s, i) =>
//           i === index
//             ? { ...s, content: data.generated_content }
//             : s
//         )
//       }));
//     } catch (err) {
//       alert("AI generation failed. Please try again.");
//     } finally {
//       setLoadingIndex(null);
//     }
//   };


//   // Download Edited DOCX
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
//         <h1 className="text-3xl font-bold text-gray-900">
//           {content.title || "Untitled Blog"}
//         </h1>
//         <div className="flex space-x-3">
//           {isEditing ? (
//             <>
//               <button
//                 onClick={handleSave}
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//               >
//                 💾 Save
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//               >
//                 ❌ Cancel
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               ✏️ Edit
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Title */}
//       <div className="mb-6">
//         {isEditing ? (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Title
//             </label>
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
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Subtitle
//             </label>
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

//       {/* Overview Section */}
//       {content?.overview && (
//         <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
//           <div className="flex justify-between items-start mb-3">
//             {isEditing ? (
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Overview
//                 </label>
//               </div>
//             ) : (
//               <h3 className="text-xl font-semibold text-gray-800">Overview</h3>
//             )}

//             {isEditing && (
//               <div className="flex items-center space-x-2 ml-4">
//                 <button
//                   disabled={loadingIndex === "overview"}
//                   onClick={() => handleAIGenerate("overview")}
//                   className={`${loadingIndex === "overview"
//                     ? "bg-blue-300 cursor-not-allowed"
//                     : "bg-indigo-600 hover:bg-indigo-700"
//                     } text-white px-3 py-1 rounded text-sm`}
//                 >
//                   {loadingIndex === "overview" ? "⏳ Generating..." : "✨ Generate with AI"}
//                 </button>
//               </div>
//             )}
//           </div>

//           {isEditing ? (
//             <textarea
//               value={content.overview}
//               onChange={(e) =>
//                 setEditedContent((prev) => ({ ...prev, overview: e.target.value }))
//               }
//               className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]"
//             />
//           ) : (
//             <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//               {content.overview}
//             </p>
//           )}
//         </div>
//       )}

//       {/* Traditional vs Current Section */}
//       {content?.traditional_vs_current && (
//         <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
//           <div className="flex justify-between items-start mb-3">
//             {isEditing ? (
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Traditional vs Current
//                 </label>
//               </div>
//             ) : (
//               <h3 className="text-xl font-semibold text-gray-800">
//                 Traditional vs Current
//               </h3>
//             )}

//             {isEditing && (
//               <div className="flex items-center space-x-2 ml-4">
//                 <button
//                   disabled={loadingIndex === "traditional_vs_current"}
//                   onClick={() => handleAIGenerate("traditional_vs_current")}
//                   className={`${loadingIndex === "traditional_vs_current"
//                     ? "bg-blue-300 cursor-not-allowed"
//                     : "bg-indigo-600 hover:bg-indigo-700"
//                     } text-white px-3 py-1 rounded text-sm`}
//                 >
//                   {loadingIndex === "traditional_vs_current"
//                     ? "⏳ Generating..."
//                     : "✨ Generate with AI"}
//                 </button>
//               </div>
//             )}
//           </div>

//           {isEditing ? (
//             <textarea
//               value={content.traditional_vs_current}
//               onChange={(e) =>
//                 setEditedContent((prev) => ({
//                   ...prev,
//                   traditional_vs_current: e.target.value,
//                 }))
//               }
//               className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]"
//             />
//           ) : (
//             <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//               {content.traditional_vs_current}
//             </p>
//           )}
//         </div>
//       )}

//       {/* Blog Body Sections */}
//       {content?.body?.map((section, index) => (
//         <div
//           key={index}
//           className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
//         >
//           <div className="flex justify-between items-start mb-3">
//             {isEditing ? (
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Section Heading {index + 1}
//                 </label>
//                 {/* Dropdown for multiple heading choices */}
//                 <select
//                   value={section.headings?.[0] || ""}
//                   onChange={(e) => {
//                     const newHeading = e.target.value;
//                     setEditedContent((prev) => ({
//                       ...prev,
//                       body: prev.body.map((s, i) =>
//                         i === index ? { ...s, headings: [newHeading] } : s
//                       ),
//                     }));
//                   }}
//                   className="w-full p-2 border rounded font-semibold"
//                 >
//                   {section.headings?.map((h, i) => (
//                     <option key={i} value={h}>
//                       {h}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ) : (
//               <h3 className="text-xl font-semibold text-gray-800">
//                 {section.headings?.[0]}
//               </h3>
//             )}

//             {isEditing && (
//               <div className="flex items-center space-x-2 ml-4">
//                 <button
//                   disabled={loadingIndex === index}
//                   onClick={() => handleAIGenerate(index)}
//                   className={`${loadingIndex === index
//                       ? "bg-blue-300 cursor-not-allowed"
//                       : "bg-indigo-600 hover:bg-indigo-700"
//                     } text-white px-3 py-1 rounded text-sm`}
//                 >
//                   {loadingIndex === index ? "⏳ Generating..." : "✨ Generate with AI"}
//                 </button>

//                 <button
//                   onClick={() => removeSection(index)}
//                   className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
//                 >
//                   🗑️
//                 </button>
//               </div>
//             )}
//           </div>

//           {isEditing ? (
//             <textarea
//               value={section.content || ""}
//               onChange={(e) => handleSectionContentChange(index, e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]"
//               placeholder="Section content..."
//             />
//           ) : (
//             <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//               {section.content}
//             </p>
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

//       {content?.seo_meta && (
//         <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
//           <h3 className="font-semibold text-gray-800 mb-2">SEO Meta Description</h3>
//           {isEditing ? (
//             <textarea
//               value={content.seo_meta}
//               onChange={(e) =>
//                 setEditedContent((prev) => ({
//                   ...prev,
//                   seo_meta: e.target.value,
//                 }))
//               }
//               className="w-full p-3 border border-gray-300 rounded-lg min-h-[80px]"
//             />
//           ) : (
//             <p className="text-gray-600 italic">{content.seo_meta}</p>
//           )}
//         </div>
//       )}

//       {content?.figure1_prompt && (
//         <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
//           <h3 className="font-semibold text-gray-800 mb-2">Illustration Prompt</h3>
//           {isEditing ? (
//             <textarea
//               value={content.figure1_prompt}
//               onChange={(e) =>
//                 setEditedContent((prev) => ({
//                   ...prev,
//                   figure1_prompt: e.target.value,
//                 }))
//               }
//               className="w-full p-3 border border-gray-300 rounded-lg min-h-[80px]"
//             />
//           ) : (
//             <p className="text-gray-700 italic">{content.figure1_prompt}</p>
//           )}
//         </div>
//       )}

//       {/* Download Original Button */}
//       {!isEditing && blog.docx_file && (
//         <div className="mt-6 pt-4 border-t">
//           <a
//             href={`${API_URL}/${blog.docx_file}`}
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

const API_URL = "http://localhost:8000";

export default function BlogViewer({ blog }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [headingErrors, setHeadingErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!blog) return null;

  // Initialize edited content when blog changes
  if (!editedContent && blog.blog_content) {
    setEditedContent(JSON.parse(JSON.stringify(blog.blog_content)));
  }

  const content = isEditing ? editedContent : blog.blog_content;

  // ✅ Add the missing handleSave function
  const handleSave = async () => {
    if (!editedContent) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/update-blog/${blog.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedContent.title,
          subtitle: editedContent.subtitle,
          content_json: editedContent,
          overview: editedContent.overview,
          traditional_vs_current: editedContent.traditional_vs_current,
          figure1_prompt: editedContent.figure1_prompt,
          conclusion: editedContent.conclusion,
          tags: editedContent.tags,
          seo_meta: editedContent.seo_meta,
        }),
      });

      if (!response.ok) throw new Error("Failed to save blog");

      const result = await response.json();
      console.log("Blog saved successfully:", result);

      // Exit editing mode
      setIsEditing(false);
      // Optionally refresh the blog data
      if (blog.onUpdate) {
        blog.onUpdate();
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      console.log("Saving changes:", editedContent);
      handleSave(); // Call the save function when toggling off edit mode
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
    const heading = Array.isArray(section.headings)
      ? section.headings[0]
      : section.heading;

    if (!heading || heading.trim().toLowerCase() === "new section") {
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
          new_heading: heading
        }),
      });

      if (!response.ok) throw new Error("AI generation failed");
      const data = await response.json();

      setEditedContent(prev => ({
        ...prev,
        body: prev.body.map((s, i) =>
          i === index
            ? { ...s, content: data.generated_content }
            : s
        )
      }));
    } catch (err) {
      alert("AI generation failed. Please try again.");
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
        <h1 className="text-3xl font-bold text-gray-900">
          {content?.title || "Untitled Blog"}
        </h1>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`${saving ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded`}
              >
                {saving ? '💾 Saving...' : '💾 Save'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                ❌ Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ✏️ Edit
            </button>
          )}
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

      {/* Overview Section */}
      {content?.overview && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            {isEditing ? (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overview
                </label>
              </div>
            ) : (
              <h3 className="text-xl font-semibold text-gray-800">Overview</h3>
            )}

            {isEditing && (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  disabled={loadingIndex === "overview"}
                  onClick={() => handleAIGenerate("overview")}
                  className={`${loadingIndex === "overview"
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white px-3 py-1 rounded text-sm`}
                >
                  {loadingIndex === "overview" ? "⏳ Generating..." : "✨ Generate with AI"}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={content.overview}
              onChange={(e) =>
                setEditedContent((prev) => ({ ...prev, overview: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {content.overview}
            </p>
          )}
        </div>
      )}

      {/* Traditional vs Current Section */}
      {content?.traditional_vs_current && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            {isEditing ? (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Traditional vs Current
                </label>
              </div>
            ) : (
              <h3 className="text-xl font-semibold text-gray-800">
                Traditional vs Current
              </h3>
            )}

            {isEditing && (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  disabled={loadingIndex === "traditional_vs_current"}
                  onClick={() => handleAIGenerate("traditional_vs_current")}
                  className={`${loadingIndex === "traditional_vs_current"
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white px-3 py-1 rounded text-sm`}
                >
                  {loadingIndex === "traditional_vs_current"
                    ? "⏳ Generating..."
                    : "✨ Generate with AI"}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={content.traditional_vs_current}
              onChange={(e) =>
                setEditedContent((prev) => ({
                  ...prev,
                  traditional_vs_current: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {content.traditional_vs_current}
            </p>
          )}
        </div>
      )}

      {/* Blog Body Sections */}
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
                {/* Dropdown for multiple heading choices */}
                <select
                  value={section.headings?.[0] || ""}
                  onChange={(e) => {
                    const newHeading = e.target.value;
                    setEditedContent((prev) => ({
                      ...prev,
                      body: prev.body.map((s, i) =>
                        i === index ? { ...s, headings: [newHeading] } : s
                      ),
                    }));
                  }}
                  className="w-full p-2 border rounded font-semibold"
                >
                  {section.headings?.map((h, i) => (
                    <option key={i} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <h3 className="text-xl font-semibold text-gray-800">
                {section.headings?.[0]}
              </h3>
            )}

            {isEditing && (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  disabled={loadingIndex === index}
                  onClick={() => handleAIGenerate(index)}
                  className={`${loadingIndex === index
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white px-3 py-1 rounded text-sm`}
                >
                  {loadingIndex === index ? "⏳ Generating..." : "✨ Generate with AI"}
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
            <textarea
              value={section.content || ""}
              onChange={(e) => handleSectionContentChange(index, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]"
              placeholder="Section content..."
            />
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

      {content?.seo_meta && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-800 mb-2">SEO Meta Description</h3>
          {isEditing ? (
            <textarea
              value={content.seo_meta}
              onChange={(e) =>
                setEditedContent((prev) => ({
                  ...prev,
                  seo_meta: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[80px]"
            />
          ) : (
            <p className="text-gray-600 italic">{content.seo_meta}</p>
          )}
        </div>
      )}

      {content?.figure1_prompt && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-800 mb-2">Illustration Prompt</h3>
          {isEditing ? (
            <textarea
              value={content.figure1_prompt}
              onChange={(e) =>
                setEditedContent((prev) => ({
                  ...prev,
                  figure1_prompt: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[80px]"
            />
          ) : (
            <p className="text-gray-700 italic">{content.figure1_prompt}</p>
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