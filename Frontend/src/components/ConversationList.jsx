import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConversationList() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                setError("");

                const email = localStorage.getItem("chatx_email");
                if (!email) {
                    setError("No user email found in local storage.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `https://localhost:7054/Conversation/ConversationForUser/${email}`,
                    { headers: { "Content-Type": "application/json" } }
                );

                if (!response.ok) throw new Error("Failed to fetch conversations");

                const data = await response.json();
                setConversations(data);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
                Loading conversations...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600 text-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
                    ChatX Conversations
                </h1>

                <div className="bg-white shadow-lg rounded-2xl border overflow-hidden">
                    {conversations.length === 0 ? (
                        <p className="text-center text-gray-500 py-6">No conversations yet.</p>
                    ) : (
                        conversations.map((conv) => {
                            const email = localStorage.getItem("chatx_email");
                            const currentUsername = email?.split("@")[0];
                            const otherUser = conv.members.find((m) => m.username !== currentUsername);
                            const lastMsg = conv.lastMessage;

                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => navigate(`/conversation/${conv.id}`)} // 🔹 Navigate to conversation
                                    className="flex justify-between items-center p-4 hover:bg-gray-100 border-b last:border-b-0 cursor-pointer transition"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                            {otherUser?.displayName?.charAt(0)?.toUpperCase() || "?"}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-lg">
                                                {otherUser?.displayName || "Unknown User"}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate w-64">
                                                {lastMsg ? lastMsg.body : "No messages yet"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-400 text-right">
                                        {new Date(conv.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
