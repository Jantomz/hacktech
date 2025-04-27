import React, { useState } from "react";
import axios from "axios";

const RAGBot: React.FC = () => {
    const [chatHistory, setChatHistory] = useState<
        { user: string; bot: string }[]
    >([
        {
            user: "",
            bot: "Hi! I'm Ava, the Atlas Virtual Assistant. Feel free to ask me about board meetings and budget interpretation. And I'll do my best to assist you!",
        },
    ]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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
        <div className="fixed bottom-6 right-6 z-40">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none transition-all duration-300"
            >
                {isOpen ? "Close" : "Ask Ava"}
            </button>
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-96 bg-white shadow-xl rounded-lg p-6 border border-gray-200">
                    <div className="h-72 overflow-y-auto border-b border-gray-300 mb-4">
                        {chatHistory.map((entry, index) => (
                            <div key={index} className="mb-4">
                                {entry.user && (
                                    <div className="text-blue-600 font-semibold mb-1">
                                        You:{" "}
                                        <span className="text-gray-800">
                                            {entry.user}
                                        </span>
                                    </div>
                                )}
                                <div className="text-gray-700 bg-gray-100 p-2 rounded-lg">
                                    <div className="">
                                        <span className="font-semibold text-indigo-600">
                                            Ava:{" "}
                                        </span>
                                        {entry.bot}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type your query here..."
                            disabled={loading}
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <button
                            onClick={handleSendQuery}
                            disabled={loading || !query.trim()}
                            className={`px-5 py-2 rounded-lg text-white font-semibold transition-all duration-300 cursor-pointer ${
                                loading || !query.trim()
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                            }`}
                        >
                            {loading ? "Loading..." : "Send"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RAGBot;
