from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from agent import chatbot, ContextSchema
from fastapi.middleware.cors import CORSMiddleware
import asyncio


from memory import get_summary,sumarise_and_update_memory

app = FastAPI()

origins = [
    "http://localhost:5173",  # React dev server
    # "https://your-frontend-domain.com" for production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # allow POST, GET, OPTIONS, etc.
    allow_headers=["*"],  # allow Authorization header
)

class Message(BaseModel):
    text: str
    thread_id: str



@app.post('/')
async def chatEndpoint(message: Message):
    print(message.text)
    summary = await asyncio.to_thread(get_summary, message)
    res = chatbot.invoke({'messages':[HumanMessage(content=message.text)]}, config={'configurable':{'thread_id':message.thread_id}})
    asyncio.create_task(sumarise_and_update_memory(message, res['messages'][-1].content))
    return {'response':res['messages'][-1].content}

#{"summary": summary}