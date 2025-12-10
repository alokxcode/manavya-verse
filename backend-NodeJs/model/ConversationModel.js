import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    thread_id: {
        type: String,
        required:true,
        unique:true
    },

    chat_messages: [
        {
            sender:{
                type:String,
                enum:['user','ai'],
                required:true,
            },
            text:{
                type:String,
                required:true
            },
            createdAt:{
                type:Date,
                default:Date.now
            }

        }
    ]
}, {timestamps:true})

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;