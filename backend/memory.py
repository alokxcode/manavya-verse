from tokenize import Ignore
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI,GoogleGenerativeAIEmbeddings


load_dotenv()

mongo_uri = os.getenv('DB_URI')

client = MongoClient(mongo_uri)

db = client['pydata']

class Summary(BaseModel):
    thread_id: str
    summaries:list[str] 

    class Config:
        extra= "ignore"

api_key = os.getenv("GOOGLE_API_KEY")
model = os.getenv("MODEL")
Summary_LLM = ChatGoogleGenerativeAI(model= model, api_key= api_key)
Memory_LLM = ChatGoogleGenerativeAI(model= model, api_key= api_key)
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

#short term memory

# update summary 
async def sumarise_and_update_memory(message,res):
    msg_dict = {
        "userMessage" : message.text,
        "AIMessage": res
    }
    prompt = f''' Summarise this conversation in one very short sentence in a way that you don't leave important detail {msg_dict} '''
    # send to llm to summarise
    summary = Summary_LLM.invoke(prompt).content
    thread_id = message.thread_id
    new_summary = db.summary.update_one({"thread_id":thread_id},{"$push":{"summaries":summary}}, upsert=True)
    return new_summary


# get summary
def get_summary(message):
    thread_id = message.thread_id
    summary = db.summary.find_one({"thread_id":thread_id})
    if not summary:
        return 'right now, there is no any summary'
    summary_model = Summary(**summary)
    return ' '.join(summary_model.summaries)

# long term memory

def get_longTerm_memory(message):
    print(message)

def save_longTerm_memory(message, res):
    text = message.text
    prompt = f''' Act like an agent that filter long term memory( memory that can be used in the future conversation ) from conversation. Check if this conversation contain anything important. IF yes then reply in one word 'true' and if no then reply in one word 'false' 
     Important Note : Reply in one word only. True or False
     '''
    res = Memory_LLM.invoke(prompt).content

    if res != 'true':
        return
    else:
        db.memory.update()





