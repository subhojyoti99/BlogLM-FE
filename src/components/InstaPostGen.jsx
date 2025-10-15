import React, { useState } from "react";
import axios from "axios";

export default function InstaPostGen({ blogContent, blogId, blogType }) {
    const [loading, setLoading] = useState(false);
    const [carousel, setCarousel] = useState(null);
    const [error, setError] = useState(null);
    const [prompt, setPrompt] = useState("")

    const handleGenerate = async () => {
        console.log("hello", blogContent, blogId)
        if (!blogContent?.trim()) {
            setError("No blog content found. Please generate a blog first.");
            return;
        }

        setError(null);
        setLoading(true);
        setCarousel(null);

        try {
            const res = await axios.post(`http://localhost:8000/generate-instagram-carousel`, {
                blog_content: blogContent,
                blog_id: blogId,
                blog_type: blogType,
                customization_prompt: prompt,
            });

            setCarousel(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Generation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 shadow rounded-2xl">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 text-center">
                📸 Generate Instagram Carousel
            </h2>
            <label className="block text-sm font-medium text-gray-600 mb-2">
                🖌️ Customize Image Style (e.g., “pink gradient background, modern typography”)
            </label>

            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-800"
                placeholder="Describe your desired style or background..."
            ></textarea>

            <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-2 mt-2 rounded-lg text-white font-semibold ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700"
                    }`}
            >
                {/* {loading ? "Generating Carousel..." : "✨ Generate Carousel from Blog"} */}
                {loading
                    ? "Generating Carousel..."
                    : carousel
                        ? "🔁 Regenerate Carousel"
                        : "✨ Generate Carousel from Blog"}
            </button>

            {error && (
                <p className="text-red-600 text-center mt-3 font-medium">{error}</p>
            )}

            {carousel && (
                <div className="mt-6">
                    <h3 className="font-semibold text-lg text-gray-700 mb-2">
                        🗒️ About the Slides
                    </h3>
                    <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap text-sm">
                        {carousel.carousel_text}
                    </pre>

                    <h3 className="font-semibold text-lg text-gray-700 mt-4 mb-2">
                        🖼️ Generated Images
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {carousel.image_filenames &&
                            Object.entries(carousel.image_filenames).map(([filename, base64], i) => (
                                <div key={filename} className="flex flex-col items-center">
                                    <img
                                        src={base64 || ""}
                                        alt={`Slide ${i + 1}`}
                                        className="rounded-lg shadow-md w-full h-auto"
                                    />
                                    <p className="text-xs text-gray-500 mt-1 break-all">
                                        {filename}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
