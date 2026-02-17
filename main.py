from fastapi import FastAPI, HTTPException
from enum import Enum
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}



class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

#Path parameters with Enum
@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name is ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}

    if model_name.value == "lenet":
        return {"model_name": model_name, "message": "LeCNN all the images"}

    return {"model_name": model_name, "message": "Have some residuals"}


#query parameters type conversion
@app.get("/items1/{item_id}")
async def read_item1(item_id: str, q: str | None = None, short: bool = False):
    item = {"item_id": item_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update(
            {"description": "This is an amazing item that has a long description"}
        )
    return item

#Multiple path and query parameters
@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(
    user_id: int, item_id: str, q: str | None = None, short: bool = False
):
    item = {"item_id": item_id, "owner_id": user_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update(
            {"description": "This is an amazing item that has a long description"}
        )
    return item

#Create a data model
class Item2(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.post("/items2/")
async def create_item(item: Item2):
    return item

#client = OpenAI()
class openaichat(BaseModel):
    message: str
    
@app.post("/openaitest/")
async def openai_test(request: openaichat):
    try:
        api_key=os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OPENAI_API_KEY not found in environment variables")
        
        client = OpenAI(api_key=api_key)

        response = client.chat.completions.create(
            model="gpt-5.2",
            messages=[
                {"role": "user", "content": request.message}
            ]
        )
        return {"message": response.choices[0].message.content}        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")