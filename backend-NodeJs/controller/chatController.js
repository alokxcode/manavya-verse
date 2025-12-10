import { v4 as uuidv4} from 'uuid';
import Conversation from '../model/ConversationModel.js'
import UserData from '../model/UserDataModel.js';

// Generate a new chat thread ID
export const thread = (req,res) => {
    try {
        const chat_thread_id = uuidv4();
        res.status(200).json({chat_thread_id})
    } catch (error) {
        return res.status(500).json({errors:[{msg:'error while generating thread id'}]})
    }

}

// Save chat messages to a conversation thread
export const saveChat = async (req,res) => {
    try {
        const {messages,thread_id} = req.body;
        const first_message = messages[0].text
        const user = req.user;
        // Update or create conversation document
        const conversation = await Conversation.findOneAndUpdate(
            {thread_id:thread_id},
            {$push: {chat_messages:{$each:messages}}},
            {new:true, upsert:true}
        )
        // Update user data with new conversation if not already present
        const userdata = await UserData.findOneAndUpdate(
            {userId:user._id, 'conversations.conversation_thread_id':{$ne:conversation.thread_id}},
            {$push: {conversations:{conversation_thread_id:conversation.thread_id, first_message:first_message}}},
            {new:true}
        )
        console.log('fine')
        if (!userdata) {
            // if conversation id found and messages are being pushed in that
            return res.status(200).json({message:'msg saved successfully', userData:null})
        } 

        res.status(200).json({message:'msg saved successfully', userData:[userdata]})
            
    } catch (error) {
        return res.status(500).json({errors:[{msg:'error while saving message'}]})
    }

}

// Get chat messages for a conversation thread
export const getChat =  async(req,res) => {
    try {
        const {thread_id} = req.body;
        console.log(thread_id) // printing
        const conversation = await Conversation.findOne({thread_id:thread_id}); // its not working
        console.log('is it working',conversation.chat_messages) // not printing
        if (!conversation){
            return res.status(200).json({message:'getchat success', chat_messages:[]}); 
        }
        // Return chat messages for the thread
        return res.status(200).json({message:'getchat success', chat_messages:conversation.chat_messages});  
    } catch (error) {
        return res.status(500).json({errors:[{msg:'error while getting message'}]})
    }
}