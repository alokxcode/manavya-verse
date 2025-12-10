import { useEffect } from "react";
import { UserContext } from "./Create_Context";
import { useState } from "react";

export const UserProvider = ({children}) => {
    // State for user email, conversation thread IDs, and chat messages
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);

    // On mount, fetch user details from backend
    useEffect(() => {
        const userfetch = async () => {
            const res = await fetch('http://localhost:3005/auth/me',{
                method:'GET',
                headers:{'Content-Type':'application/json'},
                credentials:'include'
            })
            const data = await res.json();
            userDetails(data.user);
            conversationsDetails(data.userData)
        }
        userfetch();
    },[]);

    // On mount, fetch chat messages for selected thread from backend
    useEffect(() => {
        const chatfetch = async () => {
            const selectedThread = localStorage.getItem('selectedThread');
            if (selectedThread){
                const response = await fetch('http://localhost:3005/chat/getchat',{
                    method:"POST",
                    headers:{'Content-Type': 'application/json'},
                    body:JSON.stringify({thread_id:selectedThread}),
                    credentials:'include'
                })
                const data = await response.json();
                messagesSet(data.chat_messages);
                }
        }
        chatfetch();
    },[])

    // Set user email in state
    const userDetails = (user) => {
        setUser(user.email);
    }

    // Set conversation thread IDs in state
    const conversationsDetails = (userData) => {
        const conversationsArray = userData[0].conversations
        setConversations(conversationsArray);
    }

    // Set chat messages in state
    const messagesSet = (chat_messages) => {
        setMessages(chat_messages);
    }

    // Provide context values to children
    return (
        <UserContext.Provider value={{user, userDetails, conversations, conversationsDetails, messages, messagesSet}}>
            {children}
        </UserContext.Provider>
    )
}