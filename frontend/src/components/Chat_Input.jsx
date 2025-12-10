import React from "react";
import { useState } from "react";

const Chat_Input = ({onsend}) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() !== "" && !isLoading) {
      setIsLoading(true);
      try {
        await onsend(input);
        setInput("");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      setInput('');
    }
  };

  return (
    <div className="px-4 pb-4 pt-4 bg-white mx-4 mb-3 rounded-b-2xl">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-center">
          {/* Main Input Container */}
          <div className="flex-1 relative bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 focus-within:border-gray-300 focus-within:shadow-xl">
            <div className="flex items-center px-4 py-3">
              {/* Text Input */}
              <input
                type="text"
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 text-base focus:outline-none resize-none max-h-32 min-h-[24px] leading-6"
                value={input}
                placeholder="Message ChatBot..."
                onChange={(e) => {setInput(e.target.value)}}
                onKeyDown={handleKeyDown}
                style={{ minHeight: '24px', maxHeight: '200px' }}
              />
              
              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={input.trim() === "" || isLoading}
                className={`ml-3 p-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                  input.trim() && !isLoading
                    ? 'bg-black hover:bg-gray-800 text-white shadow-sm hover:shadow-md'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                ) : (
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer Text */}
        <div className="text-center mt-3">
          <p className="text-xs text-gray-500">
            Kairo can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat_Input;
