// import { useEffect, useState } from "react";

// export default function Blogs() {
//     const [blogs, setBlogs] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetch("http://localhost:8000/blogs")
//             .then((res) => res.json())
//             .then((data) => {
//                 setBlogs(data.blogs);
//                 setLoading(false);
//             })
//             .catch(() => setLoading(false));
//     }, []);

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <header className="px-6 py-4 border-b bg-white shadow-sm">
//                 <h1 className="text-2xl font-bold text-blue-600">📝 All Blogs</h1>
//             </header>

//             <div className="p-6">
//                 {loading ? (
//                     <p>Loading blogs...</p>
//                 ) : blogs.length > 0 ? (
//                     <ul className="space-y-3">
//                         {blogs.map((file) => (
//                             <li
//                                 key={file}
//                                 className="p-3 border rounded bg-white shadow-sm hover:bg-blue-50 transition"
//                             >
//                                 <a
//                                     href={`http://localhost:8000/static/blogs/${file}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-700 font-medium"
//                                 >
//                                     {file.replace(".docx", "").replace(/_/g, " ")}
//                                 </a>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p className="text-gray-600">No blogs found.</p>
//                 )}
//             </div>
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Blogs() {
    const [blogsData, setBlogsData] = useState({
        docx_files: [],
        regular_blogs: [],
        blended_blogs: [],
        total_regular: 0,
        total_blended: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/blogs")
            .then((res) => res.json())
            .then((data) => {
                setBlogsData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const formatTitle = (title) => {
        return title
            .replace(/_/g, " ")
            .replace(/:/g, "")
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="px-6 py-4 border-b bg-white shadow-sm">
                <h1 className="text-2xl font-bold text-blue-600">📝 All Blogs</h1>
                <p className="text-gray-600 mt-1">
                    {blogsData.total_regular} regular blogs • {blogsData.total_blended} blended blogs
                </p>
            </header>

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <p className="text-gray-600">Loading blogs...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* DOCX Files Section */}
                        {/* {blogsData.docx_files.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    📄 Document Files ({blogsData.docx_files.length})
                                </h2>
                                <div className="grid gap-3">
                                    {blogsData.docx_files.map((file) => (
                                        <div
                                            key={file}
                                            className="p-4 border rounded-lg bg-white shadow-sm hover:bg-blue-50 transition-colors"
                                        >
                                            <a
                                                href={`http://localhost:8000/static/blogs/${file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-700 font-medium hover:text-blue-900 block"
                                            >
                                                {formatTitle(file.replace(".docx", ""))}
                                            </a>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {file}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )} */}

                        {/* Regular Blogs Section */}
                        {blogsData.regular_blogs.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Regular Blogs ({blogsData.regular_blogs.length})
                                </h2>
                                <div className="grid gap-4">
                                    {blogsData.regular_blogs.map((blog) => (
                                        <div
                                            key={blog.id}
                                            className="p-4 border rounded-lg bg-white shadow-sm hover:bg-green-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        <Link
                                                            to={`/blogs/${blog.id}/regular`}
                                                            className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
                                                        >
                                                            {blog.title}
                                                        </Link>
                                                    </h3>
                                                    {blog.subtitle && (
                                                        <p className="text-gray-600 mt-1 text-sm">
                                                            {blog.subtitle}
                                                        </p>
                                                    )}
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                            {blog.tone}
                                                        </span>
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                                            {blog.word_count} words
                                                        </span>
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                            Regular
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Created: {new Date(blog.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <a
                                                        href={`http://localhost:8000/static/blogs/${blog.docx_filename}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                                    >
                                                        Download DOCX
                                                    </a>
                                                </div>
                                            </div>
                                            {blog.linkedin_version && (
                                                <details className="mt-3">
                                                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                                                        📱 View LinkedIn Version
                                                    </summary>
                                                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap">
                                                        {blog.linkedin_version}
                                                    </div>
                                                </details>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Blended Blogs Section */}
                        {blogsData.blended_blogs.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Blended Blogs ({blogsData.blended_blogs.length})
                                </h2>
                                <div className="grid gap-4">
                                    {blogsData.blended_blogs.map((blog) => (
                                        <div
                                            key={blog.id}
                                            className="p-4 border rounded-lg bg-white shadow-sm hover:bg-purple-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        <Link
                                                            to={`/blogs/${blog.id}/blended`}
                                                            className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
                                                        >
                                                            {blog.title}
                                                        </Link>
                                                    </h3>
                                                    {blog.subtitle && (
                                                        <p className="text-gray-600 mt-1 text-sm">
                                                            {blog.subtitle}
                                                        </p>
                                                    )}
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                            {blog.tone}
                                                        </span>
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                                            {blog.word_count} words
                                                        </span>
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                                            Blended
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Created: {new Date(blog.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <a
                                                        href={`http://localhost:8000/static/blogs/${blog.docx_filename}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                                    >
                                                        Download DOCX
                                                    </a>
                                                </div>
                                            </div>
                                            {blog.linkedin_version && (
                                                <details className="mt-3">
                                                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                                                        📱 View LinkedIn Version
                                                    </summary>
                                                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap">
                                                        {blog.linkedin_version}
                                                    </div>
                                                </details>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Empty State */}
                        {blogsData.docx_files.length === 0 &&
                            blogsData.regular_blogs.length === 0 &&
                            blogsData.blended_blogs.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 text-lg">No blogs found.</p>
                                    <p className="text-gray-500 mt-2">
                                        Generate some blogs first to see them here.
                                    </p>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}