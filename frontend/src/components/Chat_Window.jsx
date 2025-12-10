import React from 'react'
import Chat_Message from './Chat_Message'
import { useEffect, useRef } from 'react';
import kairo from '../assets/kairo.png'

const Chat_Window = ({messages, isAiThinking}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior : 'smooth'})
  }, [messages]);


  return (
    <div className='flex-1 flex flex-col overflow-hidden relative'>
      {/* Chat Container with enhanced design */}
      <div className='flex-1 flex flex-col overflow-hidden bg-white mx-4  shadow-2xl border border-gray-200/60 relative'>
        {/* Main Chat Area */}
        <div className='flex-1 overflow-y-auto relative bg-gradient-to-b from-gray-50/30 via-white to-gray-50/20 chat-scroll'>
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-[0.02]' style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          {/* Chat Content */}
          <div className='relative z-10 p-6 space-y-6 min-h-full'>
            {messages.length === 0 ? (
              <div className='flex items-center justify-center h-full text-gray-500 py-12'>
                <div className='text-center max-w-md'>
                    <div className='relative mb-8'>
                    <div className='w-24 h-24 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-gray-100/50 relative overflow-hidden'>
                      {/* Animated background */}
                      <div className='absolute inset-0 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 animate-pulse'></div>
                      {/* Kairo logo image */}
                      <img src={kairo} alt="Kairo" className="w-12 h-12 relative z-10" />
                    </div>
                    <div className='absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce'>
                      <div className='w-3 h-3 bg-white rounded-full'></div>
                    </div>
                  </div>
                  <h3 className='text-2xl font-bold mb-3 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent'>Welcome, I'm Kairo</h3>
                  <p className='text-gray-600 mb-6 leading-relaxed text-base'>Start a conversation with me. Ask questions, get help, or just chat!</p>
                  <div className='flex flex-wrap justify-center gap-3 text-sm'>
                    <span className='px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-default'>💡 Ask questions</span>
                    <span className='px-4 py-2 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-full border border-indigo-200 shadow-sm hover:shadow-md transition-shadow cursor-default'>🔧 Get help</span>
                    <span className='px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full border border-purple-200 shadow-sm hover:shadow-md transition-shadow cursor-default'>💭 Just chat</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div key={index}>
                    <Chat_Message text={msg.text} sender={msg.sender} />
                  </div>
                ))}
                
                {/* AI Thinking Message */}
                {isAiThinking && (
                  <div>
                    <div className="flex justify-start mb-6 group">
                      <div className="max-w-xs lg:max-w-md xl:max-w-lg px-5 py-4 rounded-2xl shadow-lg bg-white text-gray-800 border border-gray-200/60 rounded-bl-lg mr-auto shadow-gray-200/50 relative">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                          </div>
                          <span className="text-sm text-gray-600 italic">typing...</span>
                        </div>
                        
                        {/* Message tail/pointer */}
                        <div className="absolute top-4 w-3 h-3 transform rotate-45 bg-white border-l border-t border-gray-200/60 -left-1.5"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={bottomRef} />
              </>
            )}
          </div>
        </div>

        {/* Gradient fade at bottom */}
        <div className='absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/80 to-transparent pointer-events-none rounded-b-2xl'></div>
      </div>
    </div>
  );
}

export default Chat_Window