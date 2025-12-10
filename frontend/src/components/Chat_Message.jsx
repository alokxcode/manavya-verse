import React from 'react'
import kairo from '../assets/kairo.png'

const Chat_Message = ({text,sender}) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-5 py-4 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl relative message-hover ${
        sender === 'user' 
          ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white rounded-br-lg ml-auto shadow-blue-200/50' 
          : 'bg-white text-gray-800 border border-gray-200/60 rounded-bl-lg mr-auto shadow-gray-200/50'
      }`}>
        {/* Message content */}
        <div className="text-sm font-medium leading-relaxed">
          {text}
        </div>
        
        {/* Message metadata */}
        <div className={`flex items-center justify-between mt-3 text-xs ${
          sender === 'user' ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <div className="flex items-center gap-2">
            {sender === 'ai' && (
              <>

                <div className="flex items-center gap-2">
                  <img src={kairo} alt="Kairo" className="w-4 h-4 rounded-sm" />
                  <span className="font-medium pr-5">Kairo</span>
                  
                </div>
              </>
            )}
            {sender === 'user' && (
              <span className="font-medium pr-5">You</span>
            )}
          </div>
          <div className="opacity-70">
            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>

        {/* Message tail/pointer */}
        <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
          sender === 'user' 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 -right-1.5' 
            : 'bg-white border-l border-t border-gray-200/60 -left-1.5'
        }`}></div>
      </div>
    </div>
  )
};

export default React.memo(Chat_Message)