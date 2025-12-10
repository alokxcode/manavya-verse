import mongoose  from "mongoose";

const UserDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },

    conversations:[{
        conversation_thread_id: {
            type: String
        },
        first_message:{
            type:String,
        }
    }]

},{timestamps:true})

const UserData = mongoose.model('UserData', UserDataSchema)
export default UserData;