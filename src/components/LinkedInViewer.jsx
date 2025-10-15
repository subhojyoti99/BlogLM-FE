// import { useState, useRef, useEffect } from "react";

// const LinkedInViewer = ({ blogContent = "" }) => {
//     const [text, setText] = useState(blogContent);
//     const textareaRef = useRef(null);

//     // Auto-resize textarea
//     useEffect(() => {
//         const ta = textareaRef.current;
//         if (ta) {
//             ta.style.height = "auto";
//             ta.style.height = ta.scrollHeight + "px";
//         }
//     }, [text]);

//     const applyStyle = (styleType) => {
//         const ta = textareaRef.current;
//         if (!ta) return;

//         const start = ta.selectionStart;
//         const end = ta.selectionEnd;

//         if (start === end) {
//             // If no selection, insert placeholder and select it
//             const placeholder = "your text here";
//             const before = text.slice(0, start);
//             const after = text.slice(end);
//             const newText = before + placeholder + after;
//             setText(newText);

//             setTimeout(() => {
//                 ta.setSelectionRange(start, start + placeholder.length);
//                 ta.focus();
//             }, 0);
//             return;
//         }

//         const before = text.slice(0, start);
//         const selected = text.slice(start, end);
//         const after = text.slice(end);

//         let styled = selected;

//         switch (styleType) {
//             case "bold":
//                 styled = convertToBold(selected);
//                 break;
//             case "italic":
//                 styled = convertToItalic(selected);
//                 break;
//             case "underline":
//                 styled = convertToUnderline(selected);
//                 break;
//             case "strikethrough":
//                 styled = convertToStrikethrough(selected);
//                 break;
//             case "bullet":
//                 styled = `• ${selected}`;
//                 break;
//             case "number":
//                 styled = `1. ${selected}`;
//                 break;
//             default:
//                 break;
//         }

//         const newText = before + styled + after;
//         setText(newText);

//         // Restore selection around styled text
//         setTimeout(() => {
//             ta.setSelectionRange(start, start + styled.length);
//             ta.focus();
//         }, 0);
//     };

//     // Unicode conversion functions
//     const convertToBold = (text) => {
//         const boldMap = {
//             'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷',
//             'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁',
//             'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
//             'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
//             'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
//             'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
//             '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
//         };

//         return text.split('').map(char => boldMap[char] || char).join('');
//     };

//     const convertToItalic = (text) => {
//         const italicMap = {
//             'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫',
//             'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵',
//             'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
//             'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑',
//             'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛',
//             'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
//         };

//         return text.split('').map(char => italicMap[char] || char).join('');
//     };

//     const convertToUnderline = (text) => {
//         return text.split('').map(char => char + '\u0332').join('');
//     };

//     const convertToStrikethrough = (text) => {
//         return text.split('').map(char => char + '\u0336').join('');
//     };

//     const clearFormatting = () => {
//         // Combine all character maps for efficiency
//         const normalMap = {
//             // Bold characters
//             '𝗮': 'a', '𝗯': 'b', '𝗰': 'c', '𝗱': 'd', '𝗲': 'e', '𝗳': 'f', '𝗴': 'g', '𝗵': 'h', '𝗶': 'i', '𝗷': 'j',
//             '𝗸': 'k', '𝗹': 'l', '𝗺': 'm', '𝗻': 'n', '𝗼': 'o', '𝗽': 'p', '𝗾': 'q', '𝗿': 'r', '𝘀': 's', '𝘁': 't',
//             '𝘂': 'u', '𝘃': 'v', '𝘄': 'w', '𝘅': 'x', '𝘆': 'y', '𝘇': 'z',
//             '𝗔': 'A', '𝗕': 'B', '𝗖': 'C', '𝗗': 'D', '𝗘': 'E', '𝗙': 'F', '𝗚': 'G', '𝗛': 'H', '𝗜': 'I', '𝗝': 'J',
//             '𝗞': 'K', '𝗟': 'L', '𝗠': 'M', '𝗡': 'N', '𝗢': 'O', '𝗣': 'P', '𝗤': 'Q', '𝗥': 'R', '𝗦': 'S', '𝗧': 'T',
//             '𝗨': 'U', '𝗩': 'V', '𝗪': 'W', '𝗫': 'X', '𝗬': 'Y', '𝗭': 'Z',
//             '𝟬': '0', '𝟭': '1', '𝟮': '2', '𝟯': '3', '𝟰': '4', '𝟱': '5', '𝟲': '6', '𝟳': '7', '𝟴': '8', '𝟵': '9',
//             // Italic characters
//             '𝘢': 'a', '𝘣': 'b', '𝘤': 'c', '𝘥': 'd', '𝘦': 'e', '𝘧': 'f', '𝘨': 'g', '𝘩': 'h', '𝘪': 'i', '𝘫': 'j',
//             '𝘬': 'k', '𝘭': 'l', '𝘮': 'm', '𝘯': 'n', '𝘰': 'o', '𝘱': 'p', '𝘲': 'q', '𝘳': 'r', '𝘴': 's', '𝘵': 't',
//             '𝘶': 'u', '𝘷': 'v', '𝘸': 'w', '𝘹': 'x', '𝘺': 'y', '𝘻': 'z',
//             '𝘈': 'A', '𝘉': 'B', '𝘊': 'C', '𝘋': 'D', '𝘌': 'E', '𝘍': 'F', '𝘎': 'G', '𝘏': 'H', '𝘐': 'I', '𝘑': 'J',
//             '𝘒': 'K', '𝘓': 'L', '𝘔': 'M', '𝘕': 'N', '𝘖': 'O', '𝘗': 'P', '𝘘': 'Q', '𝘙': 'R', '𝘚': 'S', '𝘛': 'T',
//             '𝘜': 'U', '𝘝': 'V', '𝘞': 'W', '𝘟': 'X', '𝘠': 'Y', '𝘡': 'Z'
//         };

//         const cleaned = text
//             .replace(/[\u0332\u0336]/g, '') // Remove combining characters
//             .split('')
//             .map(char => normalMap[char] || char)
//             .join('');

//         setText(cleaned);
//     };

//     const handleCopy = () => {
//         navigator.clipboard.writeText(text);
//         alert("Copied to clipboard!");
//     };

//     const characterCount = text.length;

//     return (
//         <div className="space-y-4 p-4 max-w-2xl mx-auto">
//             <div className="flex flex-wrap gap-2">
//                 <button
//                     onClick={() => applyStyle("bold")}
//                     className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 font-semibold"
//                     title="Bold"
//                 >
//                     𝐁
//                 </button>
//                 <button
//                     onClick={() => applyStyle("italic")}
//                     className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 italic"
//                     title="Italic"
//                 >
//                     𝐼
//                 </button>
//                 <button
//                     onClick={() => applyStyle("underline")}
//                     className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 underline"
//                     title="Underline"
//                 >
//                     U̲
//                 </button>
//                 <button
//                     onClick={() => applyStyle("strikethrough")}
//                     className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 line-through"
//                     title="Strikethrough"
//                 >
//                     S̶
//                 </button>
//                 <button
//                     onClick={() => applyStyle("bullet")}
//                     className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300"
//                     title="Bullet Point"
//                 >
//                     •
//                 </button>
//                 <button
//                     onClick={() => applyStyle("number")}
//                     className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300"
//                     title="Numbered List"
//                 >
//                     1.
//                 </button>
//                 <button
//                     onClick={clearFormatting}
//                     className="px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg border border-red-300"
//                     title="Clear Formatting"
//                 >
//                     Clear
//                 </button>
//                 <button
//                     onClick={handleCopy}
//                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
//                 >
//                     Copy Text
//                 </button>
//             </div>

//             <div className="relative">
//                 <textarea
//                     ref={textareaRef}
//                     className="w-full p-4 border border-gray-300 rounded-lg resize-none min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     placeholder="Start typing or paste your caption here..."
//                     style={{
//                         overflow: "hidden",
//                         overflowWrap: "break-word",
//                         resize: "none",
//                         fontFamily: "system-ui, -apple-system, sans-serif",
//                         lineHeight: "1.5"
//                     }}
//                 />
//                 <div className="absolute bottom-2 right-2 text-sm text-gray-500">
//                     {characterCount}/3000
//                 </div>
//             </div>

//             <div className="text-sm text-gray-600">
//                 <p><strong>Tip:</strong> Select text and click formatting buttons, or click buttons first to insert placeholder text.</p>
//                 <p><strong>Note:</strong> Uses Unicode characters for formatting that work on LinkedIn and other social platforms.</p>
//             </div>
//         </div>
//     );
// };

// export default LinkedInViewer;


import { useState } from "react";
import { Copy } from "lucide-react";

export default function LinkedInViewer({ linkedInVersion }) {
    const [copied, setCopied] = useState(false);

    if (!linkedInVersion) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(linkedInVersion);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="mt-8 bg-white shadow-lg rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                        alt="LinkedIn"
                        className="w-5 h-5"
                    />
                    LinkedIn Optimized Version
                </h2>

                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${copied
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>

            <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                {linkedInVersion}
            </div>
        </div>
    );
}
