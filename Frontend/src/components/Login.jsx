import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [loginEmail, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError("");

            // Step 1: Call Login API
            const loginResponse = await fetch("https://localhost:7054/Auth/Login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginEmail, password }),
            });

            if (!loginResponse.ok) throw new Error("Login failed");

            // Step 2: Store email
            localStorage.setItem("chatx_email", loginEmail);

            // Step 3: Fetch conversations for this user
            const convResponse = await fetch(
                `https://localhost:7054/Conversation/ConversationForUser/${loginEmail}`
            );

            if (!convResponse.ok) throw new Error("Failed to load conversations");

            const data = await convResponse.json();

            // Step 4: Cache conversations and navigate
            localStorage.setItem("chatx_conversations", JSON.stringify(data));
            navigate("/chat");
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
                    ChatX
                </h1>
                <p className="text-center text-gray-500 mb-6">Login to continue</p>

                <div className="flex flex-col space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </div>
        </div>
    );
}
