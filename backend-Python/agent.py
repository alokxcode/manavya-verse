from langgraph.graph import StateGraph, START,END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, BaseMessage
from langgraph.graph.message import add_messages
from typing import TypedDict, Annotated
from dotenv import load_dotenv
import os
from langgraph.checkpoint.mongodb import MongoDBSaver
from pymongo import MongoClient
from langgraph.runtime import Runtime
from dataclasses import dataclass





#LLM
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
model = os.getenv("MODEL")
LLM = ChatGoogleGenerativeAI(model= model, api_key= api_key)
Summarise_LLM = ChatGoogleGenerativeAI(model= model, api_key= api_key)

# state
class chatState(TypedDict):
    messages: Annotated[list[BaseMessage],add_messages]

DB_URI = os.getenv('DB_URI')
client = MongoClient(DB_URI)
checkpointer = MongoDBSaver(client) if client else None

graph = StateGraph(chatState)

@dataclass
class ContextSchema:
    summary:str

# runtime:Runtime[ContextSchema]
    
msgObj = []
# generate function
def chatNode(state:chatState):
    messages = [msg.content for msg in state["messages"]]  # clean list
    new_msg = messages[-1] if messages else ""
    # summary = runtime.context.summary if runtime.context else ""



    prompt = f''' Your are an friend, your name is Kairo , talks like an real friend in short msg type chats, do not need to unneccessarly send large text
     
    Your Question : {new_msg}

    Old Conversation : 
       '''

    response = LLM.invoke(prompt).content



    return {"messages":[response]}



# nodes
graph.add_node('chatNode', chatNode)

# edges
graph.add_edge(START, 'chatNode')
graph.add_edge("chatNode", END)

# compile
chatbot = graph.compile(checkpointer=checkpointer)


# thread_id = '1'

# while True:
#     user_message = input('Type here: ')

#     print("You: ",user_message)

#     if user_message.strip().lower() in ['exit','quit', 'bye']:
#         break

#     config = {'configurable':{'thread_id':thread_id}}
#     response = chatbot.invoke({
#         'messages':[HumanMessage(content=user_message)]
#     }, config=config)

#     print("AI: ", response['messages'][-1].content )