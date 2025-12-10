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
checkpointer = MongoDBSaver(client['message_state'])

graph = StateGraph(chatState)

@dataclass
class ContextSchema:
    summary:str
    
msgObj = []
# generate function
def chatNode(state:chatState, runtime:Runtime[ContextSchema]):
    print(state['messages'])
    for msg in state["messages"]:
        msgObj.append({msg.content})

    newMsg = msgObj[-1]
    recentMsg = msgObj[-5:]


    prompt = f''' Your are an virutal friend, your name is Kairo , talks like an real friend in short msg type chats, do not need to unneccessarly send large text
     
    Your Question : {newMsg}

    Old Conversation : {runtime.context['summary']}
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