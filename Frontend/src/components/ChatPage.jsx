import React, { useEffect, useState, useRef } from "react";

export default function ChatPage() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingConversation, setLoadingConversation] = useState(false);
    const [error, setError] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const email = localStorage.getItem("chatx_email");
    const currentUsername = email?.split("@")[0];

    // Scroll to bottom when messages update
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(scrollToBottom, [selectedConversation]);

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoadingConversations(true);
                const res = await fetch(
                    `https://localhost:7054/Conversation/ConversationForUser/${email}`
                );
                if (!res.ok) throw new Error("Failed to load conversations");
                const data = await res.json();
                setConversations(data);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoadingConversations(false);
            }
        };

        fetchConversations();
    }, [email]);

    // Fetch selected conversation by ID
    const loadConversation = async (conversationId) => {
        try {
            setLoadingConversation(true);
            const res = await fetch(
                `https://localhost:7054/Conversation/ConversationById/${conversationId}`
            );
            if (!res.ok) throw new Error("Failed to load conversation");
            const data = await res.json();
            setSelectedConversation(data);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoadingConversation(false);
        }
    };

    const handleSend = () => {
        if (!newMessage.trim()) return;

        // Append new message locally
        setSelectedConversation((prev) => ({
            ...prev,
            latestMessage: {
                id: Date.now(),
                body: newMessage,
                senderId: email,
                createdAt: new Date().toISOString(),
            },
        }));
        setNewMessage("");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left: Conversation List */}
            <div className="w-1/3 border-r bg-white overflow-y-auto">
                <h1 className="text-2xl font-bold text-blue-600 p-4 border-b">ChatX</h1>

                {loadingConversations ? (
                    <p className="p-4 text-gray-500">Loading conversations...</p>
                ) : (
                    conversations.map((conv) => {
                        const otherUser = conv.members?.find((m) => m.username !== currentUsername) ||
                            conv.participants?.find((m) => m.username !== currentUsername);
                        const lastMsg = conv.lastMessage || conv.latestMessage;

                        return (
                            <div
                                key={conv.id}
                                onClick={() => loadConversation(conv.id)}
                                className={`flex justify-between items-center p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedConversation?.id === conv.id ? "bg-gray-100" : ""
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                        {otherUser?.displayName?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{otherUser?.displayName || "Unknown"}</h3>
                                        <p className="text-sm text-gray-500 truncate w-40">
                                            {lastMsg ? lastMsg.body : "No messages yet"}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(conv.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Right: Selected Conversation */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Header */}
                        <div className="bg-white p-4 shadow flex justify-between items-center border-b">
                            <h2 className="text-xl font-semibold text-blue-600">
                                {selectedConversation.participants
                                    ?.find((p) => p.username !== currentUsername)?.displayName || "Conversation"}
                            </h2>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                            {loadingConversation ? (
                                <p className="text-gray-500">Loading messages...</p>
                            ) : selectedConversation.latestMessage ? (
                                <div
                                    className={`max-w-xs p-2 rounded-lg ${selectedConversation.latestMessage.senderId === email
                                            ? "bg-blue-600 text-white ml-auto"
                                            : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    <p>{selectedConversation.latestMessage.body}</p>
                                    <span className="text-xs text-gray-500 mt-1 block">
                                        {new Date(selectedConversation.latestMessage.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-gray-500">No messages yet.</p>
                            )}
                            <div ref={messagesEndRef}></div>
                        </div>

                        {/* Input */}
                        <div className="bg-white p-4 flex items-center space-x-2 border-t">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSend}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a conversation
                    </div>
                )}
            </div>
        </div>
    );
}
