import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/Create_Context';
import { generateThreadId , getchat} from '../api/chatApi';
import { SignoutApi } from '../api/authApi';

const Sidebar = ({ isOpen, onToggle }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  // Get user, conversations, and messagesSet from context
  const {user, conversations, messagesSet } = useContext(UserContext);

  // Start a new conversation thread
  const handleClick = async(e) => {
    e.preventDefault();
    const result = await generateThreadId();
    if (!result.success) {
      console.log(result.errors)
    } else {
      const active_thread_id = result.thread_id;
      localStorage.setItem('activeThread', active_thread_id);
    }
    // Clear messages for new conversation
    messagesSet([]);
  }

  // Switch to a selected conversation thread and fetch its messages
  const handleThreadClick = async (e,conversation) => {
    e.preventDefault();
    messagesSet([]);
    const clicked_thread_id = conversation;
    localStorage.setItem('selectedThread', clicked_thread_id);
    localStorage.setItem('activeThread', clicked_thread_id);
    const result = await getchat();
    if (!result.success) {
      return console.log('error while fetching chat ouside getchat ',result.errors)
    } else {
      messagesSet(result.chat_messages)
    }
  }

  // Sign out the user and clear local storage
  const handlesignout = async(e) => {
    e.preventDefault();
    const result = await SignoutApi();
    if (!result.success) {
      return console.log('error while signout ',result.errors)
    } else {
      setShowProfileDropdown(false);
      localStorage.removeItem('selectedThread');
      localStorage.removeItem('activeThread');
      navigate('/signin');
    }   
  }


  return (
    <>
      {/* Sidebar */}
      <div className={`mt-3 mb-3 ml-3 rounded-2xl fixed inset-y-0 left-0 z-50 w-72 lg:w-80 bg-white/95 backdrop-blur-sm shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200/50 flex flex-col`}>
        
        {/* Sidebar Header - User Profile */}
        <div className="relative">
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 flex-1 hover:bg-white/50 rounded-lg p-2 -m-2 transition-all duration-200"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  {/* User Avatar - you can replace with an actual image */}
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>

              </div>
              <div className="flex-1 min-w-0 text-left">
                <h2 className="font-bold text-gray-900 text-base truncate">{user}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button 
              onClick={onToggle}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 ml-2"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute top-full left-4 right-4 z-50 bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-lg py-2 mt-1">
              <button
                onClick={(e) => {
                  handlesignout(e);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50/80 hover:text-red-700 transition-all duration-200 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] group">
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span onClick={handleClick} className="font-semibold">New Conversation</span>
          </button>
        </div>

        {/* Conversations History */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Conversations</h3>
          </div>
          
          <div className="px-2 space-y-2">
            {conversations.map((conv,index) => (
              <button 
                onClick={(e) => handleThreadClick(e,conv.conversation_thread_id)}
                key={index}
                className="w-full p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="block text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600">
                  {conv.first_message}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings & Help Section - Bottom */}
        <div className="mt-auto border-t border-gray-200/50 p-4 bg-gray-50/30">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-700 hover:bg-white/80 hover:text-gray-900 rounded-xl tra</svg>nsition-all duration-200 ho</svg>ver:shadow-sm group">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Settings</span>
            </button>
            <a href="https://manavyax.blogspot.com/search/label/project%20kairo?&max-results=6">           
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-700 hover:bg-white/80 hover:text-gray-900 rounded-xl transition-all duration-200 hover:shadow-sm group">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <span className="text-sm font-medium">Documentaion</span>
              
            </button>
            </a>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-transparent bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;