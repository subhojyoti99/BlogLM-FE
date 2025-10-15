import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar.jsx";
import TopicList from "../components/TopicList";
import BlogViewer from "../components/BlogViewer";
import Header from "../components/Header";
import LinkedInViewer from "../components/LinkedInViewer";
import InstaPostGen from "../components/InstaPostGen.jsx";

export default function Home() {
  const API_URL = "http://localhost:8000";

  const [query, setQuery] = useState("latest technology trends 2025");
  const [tone, setTone] = useState("professional");
  const [wordTarget, setWordTarget] = useState(700);
  const [topics, setTopics] = useState([]);
  const [searchId, setSearchId] = useState(null);
  const [mode, setMode] = useState("single");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoTopic, setAutoTopic] = useState(false);
  const [linkedInVersion, setLinkedInVersion] = useState(null);
  const [instaPost, setInstaPost] = useState(null);
  const [blogType, setBlogType] = useState("");

  const searchTopics = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/search-topics`, { params: { query } });
      setTopics(res.data.topics);
      setSearchId(res.data.search_id);

      // If auto topic is enabled, automatically select and generate blog
      if (autoTopic && res.data.topics.length > 0) {
        await generateAutoBlog(res.data.search_id, res.data.topics);
      }
    } catch {
      alert("Search failed");
    }
    setLoading(false);
  };

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
      // setBlogType(res.blog_type)
    } catch (error) {
      console.error("Auto blog generation failed:", error);
      alert("Auto blog generation failed");
    }
  };


  const generateBlog = async () => {
    setLoading(true);
    try {
      let res;
      if (mode === "single" && selectedTopics.length === 1) {
        res = await axios.post(`${API_URL}/generate-blog-from-topic`, null, {
          params: {
            search_id: searchId,
            selected_topic_index: selectedTopics[0],
            tone,
            word_target: wordTarget,
          },
        });
        setBlogType("regular");
      } else {
        res = await axios.post(`${API_URL}/generate-blended-blog`, {
          search_id: searchId,
          topic_indices: selectedTopics,
          tone,
          word_target: wordTarget,
        });
        setBlogType("blended");
      }
      setBlog(res?.data);
      setLinkedInVersion(res?.data?.linkedIn_version || null);
    } catch {
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
      />
      <div className="flex">
        <main className="flex-1 p-6">
          <TopicList
            topics={topics}
            mode={mode}
            setMode={setMode}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
            onGenerate={generateBlog}
            autoTopic={autoTopic}
          />
          <BlogViewer blog={blog} />
          <LinkedInViewer linkedInVersion={linkedInVersion} />
          {blog && (
            <div className="mt-10">
              <InstaPostGen blogContent={linkedInVersion} blogId={blog.blog_id || blog.id} blogType={blogType} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}