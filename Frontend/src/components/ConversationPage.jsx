import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ConversationPage() {
    const { conversationId } = useParams();
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const email = localStorage.getItem("chatx_email");

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `https://localhost:7054/Conversation/ConversationById/${conversationId}`
                );
                if (!res.ok) throw new Error("Failed to load conversation");

                const data = await res.json();
                setConversation(data);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchConversation();
    }, [conversationId]);

    if (loading) return <p className="text-center mt-10">Loading conversation...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!conversation) return null;

    const otherUser = conversation.participants.find(
        (p) => p.username !== email.split("@")[0]
    );

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="bg-white shadow p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-blue-600">
                    {otherUser?.displayName || "Conversation"}
                </h2>
                <button
                    onClick={() => navigate("/conversations")}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    Back
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {conversation.latestMessage ? (
                    <div
                        className={`max-w-xs p-2 rounded-lg ${conversation.latestMessage.senderId === email
                                ? "bg-blue-600 text-white ml-auto"
                                : "bg-gray-200 text-gray-800"
                            }`}
                    >
                        <p>{conversation.latestMessage.body}</p>
                        <span className="text-xs text-gray-500 mt-1 block">
                            {new Date(conversation.latestMessage.createdAt).toLocaleTimeString()}
                        </span>
                    </div>
                ) : (
                    <p className="text-gray-500">No messages yet.</p>
                )}
            </div>
        </div>
    );
}
