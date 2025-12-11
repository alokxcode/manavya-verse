import "../App.css";
import Chat_Input from "../components/Chat_Input";
import Chat_Window from "../components/Chat_Window";
import Sidebar from "../components/Sidebar";
import { useState, useContext } from "react";
import { UserContext } from "../context/Create_Context";
import { generateThreadId, saveChat } from "../api/chatApi";
import kairo from "../assets/kairo.png";

function Home() {
  const { conversationsDetails, messages, messagesSet } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Toggle sidebar open/close state
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handles sending a message when user clicks send or presses Enter
  const handleSend = async (text) => {

    // Get the active chat thread id from local storage
    let active_thread_id = localStorage.getItem("activeThread");

    // If no active thread id, generate a new one from backend
    if (active_thread_id == null) {
      const result = await generateThreadId();
      if (!result.success) {
        console.log("error while generating thread id", result.errors);
      } else {
        // Save the new thread id in local storage
        active_thread_id = result.thread_id;
        localStorage.setItem("activeThread", active_thread_id);
      }
    }
    // Add user message to messages state
    messagesSet((prev) => [...prev, { text, sender: "user" }]);

    // Show AI "thinking" indicator
    setIsAiThinking(true);
    try {
      // Send user message to AI agent backend
      const response = await fetch("http://localhost:8000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, thread_id: active_thread_id }),
      });
      const data = await response.json();

      console.log(data.response)

      // Add AI response to messages state
      messagesSet((prev) => [...prev, { text: data.response, sender: "ai" }]);

      // Hide AI "thinking" indicator
      setIsAiThinking(false);

      // Prepare latest user and AI message for saving
      let newMessage = [
        { text, sender: "user" },
        { text: data.response, sender: "ai" },
      ];
      // Save latest messages to backend/database
      const result = await saveChat(newMessage, active_thread_id);
      if (!result.success) {
        console.log(result.errors);
      } else {
        // Update conversation list if new data is returned
        if (result.userData) {
          await conversationsDetails(result.userData);
          localStorage.setItem("selectedThread", active_thread_id);
        }
      }
    } catch (error) {
      // Handle error and show fallback message
      console.error("Error sending message:", error);
      messagesSet((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong. Please try again.",
          sender: "ai",
        },
      ]);
    } 
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm shadow-sm mx-4 mt-2 rounded-t-2xl p-4 flex items-center justify-between sticky top-0 z-30 border border-gray-200/60 border-b-0">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-left gap-3 flex-1 justify-left lg:justify-left">

              {/* Use kairo.png as header logo */}
              <img src={kairo} alt="Kairo" className="w-13 h-13 object-contain" />
 
            <div className="text-center lg:text-left">
              <h3 className="text-xl lg:text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="hidden lg:inline bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Kairo
                </span>
                <span className="lg:hidden bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Kairo
                </span>
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>

              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <button className="hidden lg:flex p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-lg transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            <div className="w-10 lg:w-0"></div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Chat_Window messages={messages} isAiThinking={isAiThinking} />
          <Chat_Input onsend={handleSend} />
        </div>
      </div>
    </div>
  );
}

export default Home;
