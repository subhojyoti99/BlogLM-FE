import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import logoSrc from "../assets/lexis2.png";

export default function SearchHistorySidebar({ onSelectSearch, isOpen, onClose, user }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [historyDetails, setHistoryDetails] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const { token } = useAuth();
    const [heading, setHeading] = useState(null);
    const API_URL = "http://localhost:8000";

    useEffect(() => {
        if (!token || !user || !isOpen) {
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/search-history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHistory(response.data);
            } catch (err) {
                console.error("Failed to fetch search history:", err);
                setError("Failed to load history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [token, user, isOpen]);

    useEffect(() => {
        // Scroll to bottom when new messages are added
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const fetchHistoryDetails = async (searchId) => {
        try {
            setHistoryLoading(true);
            setChatMessages([]); // Clear previous chat

            // Fetch both history details and chat history in parallel
            const [historyResponse, chatHistoryResponse] = await Promise.all([
                axios.get(`${API_URL}/search-history/${searchId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${API_URL}/chat/${searchId}/history`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            setHistoryDetails(historyResponse.data);
            setSelectedHistory(searchId);
            setHeading(historyResponse.data.query);

            // Check if we have existing chat history
            if (chatHistoryResponse.data.messages && chatHistoryResponse.data.messages.length > 0) {
                // Use the existing chat history from database
                const formattedMessages = chatHistoryResponse.data.messages.map(msg => ({
                    id: msg.id,
                    type: msg.message_type || msg.type, // Use message_type from backend
                    content: msg.content,
                    timestamp: msg.created_at || msg.timestamp
                }));
                setChatMessages(formattedMessages);
            } else {
                // No existing chat history, so add initial summary
                if (historyResponse.data.lexis_response) {
                    try {
                        // Parse the JSON string
                        const lexis = JSON.parse(historyResponse.data.lexis_response);

                        // Extract overview (fallback to full content if missing)
                        const overviewContent = lexis.overview || historyResponse.data.lexis_response;

                        setChatMessages([
                            {
                                id: 1,
                                type: 'assistant',
                                content: overviewContent,
                                timestamp: new Date().toISOString()
                            }
                        ]);
                    } catch (err) {
                        console.error("Failed to parse lexis_response:", err);

                        // Fallback to using raw lexis_response
                        setChatMessages([
                            {
                                id: 1,
                                type: 'assistant',
                                content: historyResponse.data.lexis_response,
                                timestamp: new Date().toISOString()
                            }
                        ]);
                    }
                }
            }
        } catch (err) {
            console.error("Failed to fetch history details:", err);
            setError("Failed to load history details.");
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleNewSearch = () => {
        setSelectedHistory(null);
        setHistoryDetails(null);
        setChatMessages([]);
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || chatLoading) return;

        const userMessage = {
            id: Date.now(), // temporary ID until we get real one from backend
            type: 'user',
            content: chatInput,
            timestamp: new Date().toISOString()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setChatLoading(true);

        try {
            const response = await axios.post(`${API_URL}/chat/${selectedHistory}`, {
                message: chatInput,
                chat_history: chatMessages.map(msg => ({
                    role: msg.type === 'user' ? 'user' : 'assistant',
                    content: msg.content
                }))
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const assistantMessage = {
                id: response.data.message_id || Date.now() + 1, // Use backend message_id if available
                type: 'assistant',
                content: response.data.response,
                timestamp: response.data.timestamp || new Date().toISOString()
            };

            setChatMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error("Failed to send chat message:", err);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString(),
                isError: true
            };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setChatLoading(false);
        }
    };


    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatChatTime = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen || !user) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Sidebar Panel - Changed to left side */}
            <div className="relative w-80 bg-white h-full shadow-xl mr-auto flex flex-col">
                {/* Header with Logo */}
                <div className="border-b border-gray-200 p-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="basis-1/3 items-center">
                                <img
                                    src={logoSrc}
                                    alt="Logo"
                                />
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* History Content */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                    {selectedHistory ? (
                        // Chat Interface View
                        <div className="flex flex-col h-full">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={handleNewSearch}
                                        className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-150 text-sm"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Back
                                    </button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4"
                            >
                                <p className="text-center text-sm text-gray-600 font-medium">{heading}</p>
                                {historyLoading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="mt-2 text-sm text-gray-500">Loading conversation...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Chat Messages */}
                                        {chatMessages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                                                        ? 'bg-blue-600 text-white'
                                                        : message.isError
                                                            ? 'bg-red-100 border border-red-300 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                                                        }`}>
                                                        {formatChatTime(message.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {chatLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="border-t border-gray-200 p-4 flex-shrink-0">
                                <form onSubmit={handleChatSubmit} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Ask a question..."
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={chatLoading || historyLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!chatInput.trim() || chatLoading || historyLoading}
                                        className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        // History List View
                        <>
                            <div className="p-4 border-b border-gray-200 flex-shrink-0">
                                <p className="font-semibold text-gray-800">History</p>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="mt-2 text-sm text-gray-500">Loading history...</p>
                                    </div>
                                ) : error ? (
                                    <div className="p-4 text-center">
                                        <p className="text-sm text-red-500">{error}</p>
                                    </div>
                                ) : history.length === 0 ? (
                                    <div className="p-4 text-center">
                                        <p className="text-sm text-gray-500 italic">No search history yet.</p>
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        {history.map((item) => (
                                            <div
                                                key={item.search_id || item.id}
                                                onClick={() => fetchHistoryDetails(item.search_id || item.id)}
                                                className="group cursor-pointer p-3 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all duration-150 mb-2"
                                            >
                                                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700 line-clamp-2 mb-1">
                                                    {item.query}
                                                </p>
                                                <span className="text-xs text-gray-400">
                                                    {formatTime(item.created_at)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}