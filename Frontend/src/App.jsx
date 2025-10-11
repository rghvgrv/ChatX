import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ConversationList from "./components/ConversationList";
import ConversationPage from "./components/ConversationPage";
import ChatPage from "./components/ChatPage";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/conversations" element={<ConversationList />} />
        <Route path="/conversation/:conversationId" element={<ConversationPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}
