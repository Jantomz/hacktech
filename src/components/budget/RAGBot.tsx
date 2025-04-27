import React, { useState } from "react";
import axios from "axios";

const RAGBot: React.FC = () => {
    const [chatHistory, setChatHistory] = useState<
        { user: string; bot: string }[]
    >([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendQuery = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setChatHistory((prev) => [...prev, { user: query, bot: "..." }]);

        try {
            const response = await axios.post("/api/similarity-search", {
                text: query,
            });
            const botResponse =
                response.data?.data || "Sorry, I couldn't find an answer.";

            setChatHistory((prev) => {
                const updatedHistory = [...prev];
                updatedHistory[updatedHistory.length - 1].bot = botResponse;
                return updatedHistory;
            });
        } catch (error) {
            setChatHistory((prev) => {
                const updatedHistory = [...prev];
                updatedHistory[updatedHistory.length - 1].bot =
                    "Error: Unable to fetch response.";
                return updatedHistory;
            });
        } finally {
            setLoading(false);
            setQuery("");
        }
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4">
                <div className="h-96 overflow-y-auto border-b border-gray-300 mb-4">
                    {chatHistory.map((entry, index) => (
                        <div key={index} className="mb-4">
                            <div className="text-blue-600 font-semibold">
                                You: {entry.user}
                            </div>
                            <div className="text-gray-700">
                                Bot: {entry.bot}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type your query here..."
                        disabled={loading}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSendQuery}
                        disabled={loading || !query.trim()}
                        className={`px-4 py-2 rounded-lg text-white ${
                            loading || !query.trim()
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {loading ? "Loading..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RAGBot;
