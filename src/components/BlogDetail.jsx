import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export default function BlogDetail() {
    const { id, blogType } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("content"); // content, linkedin, instagram

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                setError(null);

                // Validate blogType
                if (blogType !== 'regular' && blogType !== 'blended') {
                    throw new Error('Invalid blog type. Use "regular" or "blended"');
                }

                const response = await fetch(`http://localhost:8000/blogs/${id}?blog_type=${blogType}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Blog not found');
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

        if (id && blogType) {
            fetchBlog();
        }
    }, [id, blogType]);

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
                            <a
                                href={`http://localhost:8000/static/blogs/${blog.docx_filename}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                📄 Download DOCX
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
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
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Blog Content Tab */}
                {activeTab === "content" && (
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="p-8">
                            {/* Summary */}
                            {blog.summary && (
                                <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                                    <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
                                    <p className="text-blue-800">{blog.summary}</p>
                                </div>
                            )}

                            {/* Blog Body */}
                            <div className="prose prose-lg max-w-none">
                                {blog.content_json?.body?.map((section, index) => (
                                    <div key={index} className="mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            {section.heading}
                                        </h2>
                                        <div className="text-gray-700 leading-relaxed">
                                            {section.content.split('\n').map((paragraph, pIndex) => (
                                                <p key={pIndex} className="mb-4">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Conclusion */}
                                {blog.content_json?.conclusion && (
                                    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            Conclusion
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {blog.content_json.conclusion}
                                        </p>
                                    </div>
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
                            </div>
                        </div>
                    </div>
                )}

                {/* LinkedIn Version Tab */}
                {activeTab === "linkedin" && (
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
                )}

                {/* Instagram Posts Tab */}
                {activeTab === "instagram" && (
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
                                                                src={base64} // already base64 data URL
                                                                alt={`Slide ${imgIndex + 1}`}
                                                                className="w-full h-32 object-cover rounded-lg shadow-sm mb-2"
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
                                    <p className="text-gray-600">No Instagram posts generated for this blog yet.</p>
                                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                        Generate Instagram Carousel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Metadata Tab */}
                {activeTab === "metadata" && (
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
                )}
            </div>
        </div>
    );
}