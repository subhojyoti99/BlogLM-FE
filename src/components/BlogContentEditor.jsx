import { useState } from "react";

export default function BlogContentEditor({ blog, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(null);

    // Copy all editing logic from BlogViewer here

    if (!blog) return null;

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-8">
                {/* Edit Toggle Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEditing ? "Editing Blog Content" : "Blog Content"}
                    </h2>
                    <div className="flex gap-2">
                        {isEditing && (
                            <button
                                onClick={handleSave}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                💾 Save Changes
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

                {/* Conditional content based on edit mode */}
                {isEditing ? (
                    // Editable version
                    <EditableBlogContent
                        content={editedContent}
                        onChange={setEditedContent}
                    />
                ) : (
                    // Read-only version
                    <ReadOnlyBlogContent content={blog.content_json} />
                )}
            </div>
        </div>
    );
}