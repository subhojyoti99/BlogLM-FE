import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

export default function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("content"); // content, linkedin, instagram
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(null);
    const [headingErrors, setHeadingErrors] = useState({});
    const [carouselLoading, setCarouselLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [carousel, setCarousel] = useState(null);

    const [prompt, setPrompt] = useState("");

    const { token } = useAuth();

    // useEffect(() => {
    //     const fetchBlog = async () => {
    //         try {
    //             setLoading(true);
    //             setError(null);

    //             const response = await fetch(`http://localhost:8000/blogs/${id}`);

    //             if (!response.ok) {
    //                 if (response.status === 404) {
    //                     throw new Error('Blog not found');
    //                 } else if (response.status === 400) {
    //                     const errorData = await response.json();
    //                     throw new Error(errorData.detail || 'Invalid request');
    //                 } else {
    //                     throw new Error('Failed to fetch blog');
    //                 }
    //             }
    //             console.log("_____________", response)
    //             const data = await response.json();
    //             setBlog(data);
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     if (id) {
    //         fetchBlog();
    //     }
    // }, [id]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`http://localhost:8000/blogs/${id}`, {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Blog not found');
                    } else if (response.status === 401) {
                        throw new Error('Please login to view this blog');
                    } else if (response.status === 400) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail || 'Invalid request');
                    } else {
                        throw new Error('Failed to fetch blog');
                    }
                }

                const data = await response.json();
                setBlog(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id && token) {
            fetchBlog();
        }
    }, [id, token]);


    useEffect(() => {
        if (isEditing && blog?.content_json) {
            setEditedContent(JSON.parse(JSON.stringify(blog.content_json)));
        }
    }, [isEditing, blog]);


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading blog...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">Error: {error}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-lg">Blog not found</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }


    const handleSectionHeadingChange = (index, value) => {
        setEditedContent((prev) => {
            if (!prev?.body) return prev;

            const updatedBody = prev.body.map((section, i) =>
                i === index ? { ...section, heading: value } : section
            );

            return { ...prev, body: updatedBody };
        });

        // Validation logic remains the same...
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


    const handleGenerate = async () => {
        console.log("Generating carousel for blog id:", id);
        setCarouselLoading(true);
        try {
            const res = await axios.post(`http://localhost:8000/generate-instagram-carousel`, {
                blog_id: parseInt(id),
                customization_prompt: prompt || ""
            });

            console.log("Instagram carousel response:", res.data);
            setCarousel(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Generation failed.");
        } finally {
            setCarouselLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {blog.title}
                            </h1>
                            {blog.subtitle && (
                                <p className="text-xl text-gray-600 mt-2">
                                    {blog.subtitle}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    {blog.tone}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                                    {blog.word_count} words
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                    Regular Blog
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                    Created: {new Date(blog.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3 ml-6">
                            {isEditing ? (
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditedContent(JSON.parse(JSON.stringify(blog.content_json)));
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    ❌ Discard Changes
                                </button>
                            ) : (
                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    📄 Download DOCX
                                </a>
                            )}

                            {isEditing ? (
                                <button
                                    onClick={async () => {
                                        try {
                                            // Ensure all complex types are properly serialized
                                            const payload = {
                                                title: editedContent.title || blog.title,
                                                subtitle: editedContent.subtitle || blog.subtitle,
                                                overview: editedContent.overview || blog.overview,
                                                traditional_vs_current: editedContent.traditional_vs_current || blog.traditional_vs_current,
                                                summary: editedContent.summary || blog.summary,
                                                figure1_prompt: editedContent.figure1_prompt || blog.figure1_prompt,
                                                seo_meta: editedContent.seo_meta || blog.seo_meta,
                                                word_count: editedContent.word_count || blog.word_count,
                                                tone: editedContent.tone || blog.tone,
                                                tags: editedContent.tags || blog.tags || [],
                                                topic_indices: editedContent.topic_indices || blog.topic_indices || [],
                                                content_json: editedContent,
                                                updated_at: new Date().toISOString(),
                                            };

                                            const response = await fetch(
                                                `http://localhost:8000/blogs/${blog.id}`,
                                                {
                                                    method: "PUT",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify(payload),
                                                }
                                            );

                                            if (!response.ok) {
                                                const errorData = await response.json();
                                                console.error('Server error details:', errorData);
                                                alert(`Error: ${errorData.detail || "Failed to update blog"}`);
                                                return;
                                            }

                                            const data = await response.json();
                                            alert("Blog updated successfully!");
                                            setIsEditing(false);

                                            setBlog((prev) => ({
                                                ...prev,
                                                ...editedContent,
                                                updated_at: new Date().toISOString(),
                                            }));
                                        } catch (err) {
                                            console.error('Update error:', err);
                                            alert("Failed to update blog: " + err.message);
                                        }
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    💾 Save Changes
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    ✏️ Edit Blog
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header >

            {/* Navigation Tabs */}
            < div className="bg-white border-b" >
                <div className="max-w-6xl mx-auto px-6">
                    <nav className="flex space-x-8">
                        {[
                            { id: "content", label: "📝 Blog Content" },
                            { id: "linkedin", label: "💼 LinkedIn Version" },
                            { id: "instagram", label: "📱 Instagram Posts" },
                            { id: "metadata", label: "🔍 Metadata" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div >

            {/* Content Area */}
            < div className="max-w-6xl mx-auto px-6 py-8" >
                {/* Blog Content Tab */}
                {
                    activeTab === "content" && (
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-8">
                                {/* Summary */}
                                {blog.summary && (
                                    <div className="mb-8 p-4 bg-white rounded-lg">
                                        <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
                                        <p className="text-blue-800">{blog.summary}</p>
                                    </div>
                                )}
                                {/* Blog Body */}
                                {/* === FULL BLOG BODY SECTION (EDITABLE OVERVIEW, TRADITIONAL VS CURRENT, BODY, CONCLUSION) === */}
                                <div className="prose prose-lg max-w-none">
                                    {isEditing ? (
                                        <>
                                            {/* === Overview Section === */}
                                            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                                                <input
                                                    type="text"
                                                    value={editedContent?.overview_heading || "Overview"}
                                                    onChange={(e) =>
                                                        setEditedContent((prev) => ({
                                                            ...prev,
                                                            overview_heading: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full p-2 border border-blue-300 rounded font-semibold text-blue-900 mb-3"
                                                    placeholder="Heading for Overview..."
                                                />
                                                <textarea
                                                    value={editedContent?.overview || blog.overview || ""}
                                                    onChange={(e) =>
                                                        setEditedContent((prev) => ({
                                                            ...prev,
                                                            overview: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full p-3 border border-gray-300 rounded-lg min-h-[150px] text-blue-800 leading-relaxed"
                                                    placeholder="Write the blog overview here..."
                                                />
                                            </div>

                                            {/* === Traditional vs Current Section === */}
                                            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                                                <input
                                                    type="text"
                                                    value={editedContent?.traditional_vs_current_heading || "Traditional Vs Current"}
                                                    onChange={(e) =>
                                                        setEditedContent((prev) => ({
                                                            ...prev,
                                                            traditional_vs_current_heading: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full p-2 border border-blue-300 rounded font-semibold text-blue-900 mb-3"
                                                    placeholder="Heading for Traditional vs Current..."
                                                />
                                                <textarea
                                                    value={editedContent?.traditional_vs_current || blog.traditional_vs_current || ""}
                                                    onChange={(e) =>
                                                        setEditedContent((prev) => ({
                                                            ...prev,
                                                            traditional_vs_current: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full p-3 border border-gray-300 rounded-lg min-h-[130px] text-blue-800 leading-relaxed"
                                                    placeholder="Compare traditional and current approaches..."
                                                />
                                            </div>

                                            {/* === Dynamic Body Sections === */}
                                            {editedContent?.body?.map((section, index) => (
                                                <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                                                    {/* Editable Section Heading */}
                                                    <div className="flex-1 relative mb-3 flex items-center space-x-2">
                                                        <input
                                                            type="text"
                                                            value={
                                                                section.preferred_heading ||
                                                                section.headings?.[0] ||
                                                                section.heading ||
                                                                ""
                                                            }
                                                            onChange={(e) => handleSectionHeadingChange(index, e.target.value)}
                                                            className={`w-full p-2 border border-blue-300 rounded font-semibold text-blue-900 ${headingErrors[index] ? "border-red-500" : ""
                                                                }`}
                                                            placeholder="Section heading..."
                                                        />

                                                        {/* Circle H hover dropdown */}
                                                        <div className="relative">
                                                            <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full cursor-pointer font-bold group">
                                                                H
                                                                <div className="absolute top-0 left-0 hidden group-hover:block bg-white border shadow-lg rounded-lg p-2 z-20 w-56">
                                                                    {(section.headings || []).map((h, hIndex) => (
                                                                        <div
                                                                            key={hIndex}
                                                                            onClick={() => handleHeadingSelect(index, hIndex)}
                                                                            className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${h === section.preferred_heading
                                                                                ? "font-bold text-blue-600"
                                                                                : "text-gray-700"
                                                                                }`}
                                                                        >
                                                                            {h}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {headingErrors[index] && (
                                                        <p className="text-sm text-red-500 mt-1">{headingErrors[index]}</p>
                                                    )}

                                                    <textarea
                                                        value={section.content || ""}
                                                        onChange={(e) =>
                                                            setEditedContent((prev) => {
                                                                const updatedBody = [...prev.body];
                                                                updatedBody[index].content = e.target.value;
                                                                return { ...prev, body: updatedBody };
                                                            })
                                                        }
                                                        className="w-full p-3 border border-gray-300 rounded-lg min-h-[150px] text-blue-800 leading-relaxed"
                                                        placeholder="Section content..."
                                                    />
                                                </div>
                                            ))}

                                            {/* === Conclusion Section === */}
                                            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                                                <input
                                                    type="text"
                                                    value={editedContent?.conclusion_heading || "Conclusion"}
                                                    onChange={(e) =>
                                                        setEditedContent((prev) => ({
                                                            ...prev,
                                                            conclusion_heading: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full p-2 border border-blue-300 rounded font-semibold text-blue-900 mb-3"
                                                    placeholder="Heading for Conclusion..."
                                                />
                                                <textarea
                                                    value={editedContent?.conclusion || blog.content_json?.conclusion || ""}
                                                    onChange={(e) =>
                                                        setEditedContent((prev) => ({
                                                            ...prev,
                                                            conclusion: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full p-3 border border-gray-300 rounded-lg min-h-[150px] text-blue-800 leading-relaxed"
                                                    placeholder="Write the conclusion here..."
                                                />
                                            </div>
                                        </>

                                    ) : (
                                        <>
                                            {/* === Overview View === */}
                                            {blog.overview && (
                                                <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                                                    <div className="flex items-center space-x-2 relative mb-2">
                                                        <h2 className="text-2xl font-bold text-gray-900">
                                                            {blog.overview_heading || "Overview"}
                                                        </h2>
                                                    </div>
                                                    <div className="text-gray-700 leading-relaxed">
                                                        {blog.overview.split("\n").map((p, i) => (
                                                            <p key={i} className="mb-4">
                                                                {p}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* === Traditional vs Current View === */}
                                            {blog.traditional_vs_current && (
                                                <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                                                    <div className="flex items-center space-x-2 relative mb-2">
                                                        <h2 className="text-2xl font-bold text-gray-900">
                                                            {blog.traditional_vs_current_heading || "Traditional Vs Current"}
                                                        </h2>
                                                    </div>
                                                    <div className="text-gray-700 leading-relaxed">
                                                        {blog.traditional_vs_current.split("\n").map((p, i) => (
                                                            <p key={i} className="mb-4">
                                                                {p}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* === Body Sections View === */}
                                            {blog.content_json?.body?.map((section, index) => (
                                                <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                                                    <div className="flex items-center space-x-2 relative mb-2">
                                                        <h2 className="text-2xl font-bold text-gray-900">
                                                            {section.preferred_heading ||
                                                                section.headings?.[0] ||
                                                                section.heading}
                                                        </h2>

                                                        <div className="relative">
                                                            <div className="w-6 h-6 flex items-center justify-center bg-indigo-500 text-white rounded-full cursor-pointer text-sm font-bold group">
                                                                H
                                                                <div className="absolute top-0 left-0 hidden group-hover:block bg-white border shadow-lg rounded-lg p-2 z-20 w-56">
                                                                    {(section.headings || []).map((h, hIndex) => (
                                                                        <div
                                                                            key={hIndex}
                                                                            onClick={() => handleHeadingSelect(index, hIndex)}
                                                                            className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${h === section.preferred_heading
                                                                                ? "font-bold text-blue-600"
                                                                                : "text-gray-700"
                                                                                }`}
                                                                        >
                                                                            {h}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-gray-700 leading-relaxed">
                                                        {section.content.split("\n").map((p, i) => (
                                                            <p key={i} className="mb-4">
                                                                {p}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* === Conclusion View === */}
                                            {blog.content_json?.conclusion && (
                                                <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                                                    <div className="flex items-center space-x-2 relative mb-2">
                                                        <h2 className="text-2xl font-bold text-gray-900">
                                                            {blog.conclusion_heading || "Conclusion"}
                                                        </h2>
                                                    </div>
                                                    <div className="text-gray-700 leading-relaxed">
                                                        {blog.content_json.conclusion.split("\n").map((p, i) => (
                                                            <p key={i} className="mb-4">
                                                                {p}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Tags */}
                                    {blog.tags && blog.tags.length > 0 && (
                                        <div className="mt-8 pt-6 border-t">
                                            <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {blog.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* SEO Meta */}
                                    {blog.seo_meta && (
                                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                                            <h4 className="font-semibold text-yellow-900 mb-2">SEO Meta Description</h4>
                                            <p className="text-yellow-800 italic">{blog.seo_meta}</p>
                                        </div>
                                    )}
                                    {/* Figure */}
                                    {blog.figure1_prompt && (
                                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                                            <h4 className="font-semibold text-yellow-900 mb-2">Figure Prompt</h4>
                                            <p className="text-yellow-800 italic">{blog.figure1_prompt}</p>
                                            <h4 className="font-bold text-orange-500 mb-2">Click Here to Generate</h4>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* LinkedIn Version Tab */}
                {
                    activeTab === "linkedin" && (
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">LinkedIn Post Version</h2>

                                {/* Main LinkedIn Content */}
                                <div className="mb-8">
                                    <h3 className="font-semibold text-gray-700 mb-3">Primary Version</h3>
                                    <div className="p-6 bg-gray-50 rounded-lg whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                                        {blog.linkedin_content || blog.linkedin_version}
                                    </div>
                                </div>

                                {/* Additional LinkedIn Posts */}
                                {blog.linkedin_posts && blog.linkedin_posts.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-4">Additional LinkedIn Posts</h3>
                                        <div className="space-y-4">
                                            {blog.linkedin_posts.map((post, index) => (
                                                <div key={index} className="p-4 border rounded-lg">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="text-sm text-gray-500">
                                                            Posted: {new Date(post.created_at).toLocaleString()}
                                                        </span>
                                                        <div className="flex gap-2 text-sm">
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                                                {post.character_count} chars
                                                            </span>
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                                Score: {post.engagement_score}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                                                        {post.post_content}
                                                    </div>
                                                    {post.hashtags && (
                                                        <div className="mt-3 pt-3 border-t">
                                                            <p className="text-sm text-gray-600">{post.hashtags}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }

                {/* Instagram Posts Tab */}
                {
                    activeTab === "instagram" && (
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Instagram Carousel Posts</h2>

                                {blog.instagram_posts && blog.instagram_posts.length > 0 ? (
                                    <div className="space-y-8">
                                        {blog.instagram_posts.map((post, index) => (
                                            <div key={index} className="border rounded-lg p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        Carousel #{index + 1}
                                                    </h3>
                                                    <span className="text-sm text-gray-500">
                                                        Created: {new Date(post.created_at).toLocaleString()}
                                                    </span>
                                                </div>

                                                {/* Slides */}
                                                <div className="mb-6">
                                                    <h4 className="font-semibold text-gray-700 mb-3">Slides ({post.images?.length || 0})</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {post.images && Object.entries(post.images).map(([filename, base64], imgIndex) => (
                                                            <div key={imgIndex} className="text-center">
                                                                <img
                                                                    src={base64}
                                                                    alt={`Slide ${imgIndex + 1}`}
                                                                    onClick={() => setSelectedImage(base64)} // 👈 open modal
                                                                    className="w-full h-32 object-cover rounded-lg shadow-sm mb-2 cursor-pointer hover:opacity-80 transition"
                                                                />
                                                                <p className="text-xs text-gray-600">{filename}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Carousel Text */}
                                                <div>
                                                    <h4 className="font-semibold text-gray-700 mb-3">About The Images</h4>
                                                    <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-sm font-sans text-gray-800">
                                                        {post.carousel_text}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            rows={3}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-800"
                                            placeholder="Describe your desired style or background..."
                                        ></textarea>
                                        <button
                                            onClick={handleGenerate}
                                            disabled={carouselLoading}
                                            className={`w-full py-2 mt-2 rounded-lg text-white font-semibold ${carouselLoading
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-pink-600 hover:bg-pink-700"
                                                }`}
                                        >
                                            {carouselLoading
                                                ? "Generating Carousel..."
                                                : carousel
                                                    ? "🔁 Regenerate Carousel"
                                                    : "✨ Generate Carousel from Blog"}
                                        </button>
                                    </div>

                                )}
                            </div>
                        </div>
                    )
                }

                {/* Metadata Tab */}
                {
                    activeTab === "metadata" && (
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Blog Metadata</h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700">Basic Information</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="font-medium text-gray-600">Blog ID:</span>
                                                <span className="ml-2 text-gray-900">{blog.id}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Search ID:</span>
                                                <span className="ml-2 text-gray-900 font-mono text-sm">{blog.search_id}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Created:</span>
                                                <span className="ml-2 text-gray-900">{new Date(blog.created_at).toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Updated:</span>
                                                <span className="ml-2 text-gray-900">{new Date(blog.updated_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Stats */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700">Content Statistics</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="font-medium text-gray-600">Sections:</span>
                                                <span className="ml-2 text-gray-900">{blog.content_json?.body?.length || 0}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">LinkedIn Posts:</span>
                                                <span className="ml-2 text-gray-900">{blog.linkedin_posts?.length || 0}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Instagram Posts:</span>
                                                <span className="ml-2 text-gray-900">{blog.instagram_posts?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* File Info */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700">File Information</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="font-medium text-gray-600">DOCX Filename:</span>
                                                <span className="ml-2 text-gray-900 font-mono text-sm">{blog.docx_filename}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full JSON View */}
                                    <div className="md:col-span-2">
                                        <details>
                                            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
                                                View Raw JSON Data
                                            </summary>
                                            <pre className="mt-3 p-4 bg-gray-100 rounded-lg overflow-x-auto text-xs">
                                                {JSON.stringify(blog, null, 2)}
                                            </pre>
                                        </details>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl w-full p-4">
                        <button
                            className="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100"
                            onClick={() => setSelectedImage(null)}
                        >
                            ✕
                        </button>
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg border border-gray-200"
                        />
                    </div>
                </div>
            )}
        </div >
    );
}