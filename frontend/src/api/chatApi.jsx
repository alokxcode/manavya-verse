

export const generateThreadId = async () => {
    try {
        const response = await fetch('http://localhost:3005/chat/threads',{
        method:"GET",
        headers:{'Content-Type':'application/json'},
        credentials:'include'
        });
        const data = await response.json();
        if (!response.ok) {
            console.log(data.errors)
            return {success:false, errors:data.errors}
        }
        return {success:true, thread_id:data.chat_thread_id}
    } catch (error) {
        return {success:false, errors:[{msg:error.message}]}       
    }

}

export const saveChat = async(messages, thread_id) => {
    try {
        const response = await fetch('http://localhost:3005/chat/save',{
            method: "POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({messages,thread_id}),
            credentials:'include'
        });
        const data = await response.json();
        if (!response.ok) {
            console.log(data.errors)
            return {success:false, errors:data.errors}
        }
        return {success:true, message:data.message, userData:data.userData}
    } catch (error) {
        return {success:false, errors:[{msg:error.message}]}  
    }
}

export const getchat = async () => {
    try {
        const selectedThread = localStorage.getItem('selectedThread');
        console.log('selectedthread',selectedThread)
        if (selectedThread){
        const response = await fetch('http://localhost:3005/chat/getchat',{
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({thread_id:selectedThread}),
            credentials:'include'
        })
        const data = await response.json();
        if (!response.ok) {
            console.log(data.errors)
            return {success:false, errors:data.errors}
        }
        return {success:true, message:data.message, chat_messages:data.chat_messages}
        
        }
    } catch (error) {
        return {success:false, errors:[{msg:error.message}]}  
    }
}
