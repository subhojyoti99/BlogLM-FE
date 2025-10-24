// import { useState } from "react";
// import axios from "axios";
// import Sidebar from "../components/Sidebar.jsx";
// import TopicList from "../components/TopicList";
// import BlogViewer from "../components/BlogViewer";
// import Header from "../components/Header";
// import LinkedInViewer from "../components/LinkedInViewer";
// import InstaPostGen from "../components/InstaPostGen.jsx";

// export default function Home() {
//   const API_URL = "http://localhost:8000";

//   const [query, setQuery] = useState("latest technology trends 2025");
//   const [tone, setTone] = useState("professional");
//   const [wordTarget, setWordTarget] = useState(700);
//   const [topics, setTopics] = useState([]);
//   const [searchId, setSearchId] = useState(null);
//   const [mode, setMode] = useState("single");
//   const [selectedTopics, setSelectedTopics] = useState([]);
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [autoTopic, setAutoTopic] = useState(false);
//   const [linkedInVersion, setLinkedInVersion] = useState(null);
//   const [instaPost, setInstaPost] = useState(null);
//   const [blogType, setBlogType] = useState("");

//   const searchTopics = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_URL}/search-topics`, { params: { query } });
//       setTopics(res.data.topics);
//       setSearchId(res.data.search_id);

//       // If auto topic is enabled, automatically select and generate blog
//       if (autoTopic && res.data.topics.length > 0) {
//         await generateAutoBlog(res.data.search_id, res.data.topics);
//       }
//     } catch {
//       alert("Search failed");
//     }
//     setLoading(false);
//   };

//   const generateAutoBlog = async (searchId, topics) => {
//     try {
//       const res = await axios.post(`${API_URL}/generate-auto-blog`, null, {
//         params: {
//           search_id: searchId,
//           tone: tone,
//           word_target: wordTarget
//         }
//       });

//       setBlog(res?.data);
//       setSelectedTopics([0]);
//       // setBlogType(res.blog_type)
//     } catch (error) {
//       console.error("Auto blog generation failed:", error);
//       alert("Auto blog generation failed");
//     }
//   };


//   const generateBlog = async () => {
//     setLoading(true);
//     try {
//       let res;
//       if (mode === "single" && selectedTopics.length === 1) {
//         res = await axios.post(`${API_URL}/generate-blog-from-topic`, null, {
//           params: {
//             search_id: searchId,
//             selected_topic_index: selectedTopics[0],
//             tone,
//             word_target: wordTarget,
//           },
//         });
//         setBlogType("regular");
//       } else {
//         res = await axios.post(`${API_URL}/generate-blended-blog`, {
//           search_id: searchId,
//           topic_indices: selectedTopics,
//           tone,
//           word_target: wordTarget,
//         });
//         setBlogType("blended");
//       }
//       setBlog(res?.data);
//       setLinkedInVersion(res?.data?.linkedIn_version || null);
//     } catch {
//       alert("Blog generation failed");
//     }
//     setLoading(false);
//   };

//   return (
//     <>
//       {/* <Header /> */}
//       <Sidebar
//         query={query}
//         setQuery={setQuery}
//         tone={tone}
//         setTone={setTone}
//         wordTarget={wordTarget}
//         setWordTarget={setWordTarget}
//         onSearch={searchTopics}
//         loading={loading}
//         autoTopic={autoTopic}
//         setAutoTopic={setAutoTopic}
//       />
//       <div className="flex">
//         <main className="flex-1 p-6">
//           <TopicList
//             topics={topics}
//             mode={mode}
//             setMode={setMode}
//             selectedTopics={selectedTopics}
//             setSelectedTopics={setSelectedTopics}
//             onGenerate={generateBlog}
//             autoTopic={autoTopic}
//           />
//           <BlogViewer blog={blog} />
//           <LinkedInViewer linkedInVersion={linkedInVersion} />
//           {blog && (
//             <div className="mt-10">
//               <InstaPostGen blogContent={linkedInVersion} blogId={blog.blog_id || blog.id} blogType={blogType} />
//             </div>
//           )}
//         </main>
//       </div>
//     </>
//   );
// }

import { useState, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar.jsx";
import TopicList from "../components/TopicList";
import BlogViewer from "../components/BlogViewer";
import Header from "../components/Header";
import LinkedInViewer from "../components/LinkedInViewer";
import InstaPostGen from "../components/InstaPostGen.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Home() {
  const API_URL = "http://localhost:8000";

  const [query, setQuery] = useState("latest technology trends 2025");
  const [tone, setTone] = useState("professional");
  const [wordTarget, setWordTarget] = useState(700);
  const [topics, setTopics] = useState([]);
  const [searchId, setSearchId] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoTopic, setAutoTopic] = useState(false);
  const [linkedInVersion, setLinkedInVersion] = useState(null);
  const [instaPost, setInstaPost] = useState(null);
  const [streamingStatus, setStreamingStatus] = useState("");
  const [summaryChunks, setSummaryChunks] = useState([]);
  const [fullSummary, setFullSummary] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);
  const [linkedIn, setLinkedIn] = useState(false);
  const [instagram, setInstagram] = useState(false);
  const [medium, setMedium] = useState(false);
  const { token } = useAuth();


  const searchTopics = async () => {
    if (isStreaming) {
      // Cancel existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }

    setLoading(true);
    setIsStreaming(true);
    setStreamingStatus("Starting search...");
    setSummaryChunks([]);
    setFullSummary("");
    setTopics([]);

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `${API_URL}/search-topics?query=${encodeURIComponent(query)}`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            'Cache-Control': 'no-cache',
            'Authorization': token ? `Bearer ${token}` : '',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsStreaming(false);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            console.log('Stream update:', data);

            handleStreamData(data);

          } catch (e) {
            console.warn('Failed to parse JSON:', line, e);
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Search cancelled');
      } else {
        console.error('Search failed:', error);
        alert(`Search failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStreamData = (data) => {
    // Handle different status updates
    switch (data.status) {
      case 'search_complete':
        setTopics(data.topics || []);
        setSearchId(data.search_id);
        setStreamingStatus("Search complete! Generating summary...");

        // If auto topic is enabled, automatically select and generate blog
        if (autoTopic && data.topics.length > 0) {
          generateAutoBlog(data.search_id, data.topics);
        }
        break;

      case 'generating_summary':
        setStreamingStatus("Analyzing content and generating summary...");
        break;

      case 'summary_in_progress':
        if (data.summary_chunk) {
          setSummaryChunks(prev => {
            const newChunks = [...prev, data.summary_chunk];
            setStreamingStatus(`Generating summary... (${newChunks.length} parts)`);
            return newChunks;
          });
        }
        break;

      case 'complete':
        setFullSummary(data.summary || summaryChunks.join(''));
        setStreamingStatus("✓ Analysis complete!");
        break;

      case 'error':
        alert(data.error || "An error occurred");
        setStreamingStatus("❌ Error occurred");
        break;

      default:
        // Fallback for data without status
        if (data.topics && data.search_id) {
          setTopics(data.topics);
          setSearchId(data.search_id);
          setStreamingStatus("Search complete - generating summary...");

          if (autoTopic && data.topics.length > 0) {
            generateAutoBlog(data.search_id, data.topics);
          }
        }
        break;
    }
  };

  const cancelSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setLoading(false);
      setStreamingStatus("Search cancelled");
    }
  };

  // const searchTopics = async () => {
  //   setLoading(true);
  //   setStreamingStatus("");
  //   setSummaryChunks([]);
  //   setFullSummary("");
  //   setTopics([]);

  //   try {
  //     const response = await fetch(`${API_URL}/search-topics-stream?query=${encodeURIComponent(query)}`);

  //     if (!response.ok) {
  //       throw new Error('Search failed');
  //     }

  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;

  //       const chunk = decoder.decode(value);
  //       const lines = chunk.split('\n').filter(line => line.trim());

  //       for (const line of lines) {
  //         try {
  //           const data = JSON.parse(line);
  //           console.log('Stream data:', data);

  //           // Handle different status updates
  //           switch (data.status) {
  //             case 'search_complete':
  //               setTopics(data.topics || []);
  //               setSearchId(data.search_id);
  //               setStreamingStatus("Search complete - generating summary...");

  //               // If auto topic is enabled, automatically select and generate blog
  //               if (autoTopic && data.topics.length > 0) {
  //                 await generateAutoBlog(data.search_id, data.topics);
  //               }
  //               break;

  //             case 'generating_summary':
  //               setStreamingStatus("Generating summary...");
  //               break;

  //             case 'summary_in_progress':
  //               if (data.summary_chunk) {
  //                 setSummaryChunks(prev => [...prev, data.summary_chunk]);
  //                 setStreamingStatus(`Generating summary... (${summaryChunks.length + 1} chunks)`);
  //               }
  //               break;

  //             case 'complete':
  //               setFullSummary(data.summary || summaryChunks.join(''));
  //               setStreamingStatus("Complete!");
  //               setLoading(false);
  //               break;

  //             default:
  //               // Handle initial response without status
  //               if (data.topics && data.search_id) {
  //                 setTopics(data.topics);
  //                 setSearchId(data.search_id);
  //                 setStreamingStatus("Search complete - generating summary...");

  //                 if (autoTopic && data.topics.length > 0) {
  //                   await generateAutoBlog(data.search_id, data.topics);
  //                 }
  //               }
  //               break;
  //           }

  //           // Handle error case
  //           if (data.error) {
  //             alert(data.error);
  //             setLoading(false);
  //             return;
  //           }

  //         } catch (e) {
  //           console.error('Error parsing stream chunk:', e);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Search failed:', error);
  //     alert("Search failed");
  //     setLoading(false);
  //   }
  // };

  const generateAutoBlog = async (searchId, topics) => {
    try {
      const res = await axios.post(`${API_URL}/generate-auto-blog`, null, {
        params: {
          search_id: searchId,
          tone: tone,
          word_target: wordTarget
        }
      });

      setBlog(res?.data);
      setSelectedTopics([0]);
    } catch (error) {
      console.error("Auto blog generation failed:", error);
      alert("Auto blog generation failed");
    }
  };

  const generateBlog = async () => {
    setLoading(true);
    try {
      let res;
      res = await axios.post(`${API_URL}/generate-with-toggle`, {
        search_id: searchId,
        topic_indices: selectedTopics,
        tone,
        word_target: wordTarget,
        platforms: {
          linkedin: linkedIn,
          instagram: instagram,
          medium: medium
        }
      }, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });

      setBlog(res?.data);
      if (res?.data?.generated_versions?.linkedin) {
        setLinkedInVersion(res.data.generated_versions.linkedin);
      }

      if (res?.data?.generated_versions?.instagram) {
        setInstaPost(res.data.generated_versions.instagram);
      }

    } catch (error) {
      if (error.response?.status === 401) {
        alert('Please login to generate blogs');
      }
      console.error("Blog generation failed:", error);
      alert("Blog generation failed");
    }
    setLoading(false);

  };

  return (
    <>
      {/* <Header /> */}
      <Sidebar
        query={query}
        setQuery={setQuery}
        tone={tone}
        setTone={setTone}
        wordTarget={wordTarget}
        setWordTarget={setWordTarget}
        onSearch={searchTopics}
        loading={loading}
        autoTopic={autoTopic}
        setAutoTopic={setAutoTopic}
        linkedIn={linkedIn}
        setLinkedIn={setLinkedIn}
        instagram={instagram}
        setInstagram={setInstagram}
        medium={medium}
        setMedium={setMedium}
      />

      <div className="flex">
        <main className="flex-1 p-6">
          {/* Streaming Status Indicator */}
          {streamingStatus && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                {isStreaming && (
                  <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                  </svg>
                )}
                <span className="text-blue-700 text-sm">{streamingStatus}</span>
                {isStreaming && (
                  <button
                    onClick={cancelSearch}
                    className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Progress bar for summary generation */}
              {streamingStatus.includes("summary") && summaryChunks.length > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((summaryChunks.length / 20) * 100, 90)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary Preview */}
          {summaryChunks.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 border rounded-lg">
              <h3 className="font-semibold mb-2">📝 Summary Preview</h3>
              <div className="text-sm text-gray-700 max-h-96 overflow-y-auto resize-y min-h-32 border rounded p-2 bg-white"> {/* Resizable */}
                <div className="whitespace-pre-wrap">
                  {summaryChunks.join('')}
                  {isStreaming && <span className="animate-pulse">▊</span>}
                </div>
              </div>
            </div>
          )}

          <TopicList
            topics={topics}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
            onGenerate={generateBlog}
            autoTopic={autoTopic}
            loading={loading}
          />
          <BlogViewer blog={blog} />
          {linkedInVersion && (
            <LinkedInViewer linkedInVersion={linkedInVersion} />
          )}
          {blog && instagram && (
            <div className="mt-10">
              <InstaPostGen blogId={blog.id} instaPost={instaPost} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}