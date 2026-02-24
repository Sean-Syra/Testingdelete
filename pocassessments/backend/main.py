from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Item2, openaichat
from database import init_db, assessments_table, users_table, responses_table, database
from scoring import score_assessment
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        await database.connect()
        init_db()
        logger.info("Database connected and initialized")
    except Exception as e:
        logger.error(f"Failed to connect to database on startup: {str(e)}")
        logger.info("Application will attempt to connect to database on first request")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    try:
        await database.disconnect()
        logger.info("Database disconnected")
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")

@app.post("/items2/")
async def create_item(item: Item2):
    """
    Submit assessment responses and save to database
    """
    try:
        # Ensure database is connected
        if not database.is_connected:
            logger.info("Reconnecting to database...")
            await database.connect()
            init_db()
        
        logger.info(f"Processing assessment submission for user: {item.user_id}")
        
        # Check if user exists, if not create user
        query = users_table.select().where(users_table.c.user_id == item.user_id)
        user_check = await database.fetch_one(query)
        
        if not user_check:
            logger.info(f"Creating new user: {item.user_id}")
            query = users_table.insert().values(
                user_id=item.user_id,
                name=item.user_name,
                email=item.user_email
            )
            await database.execute(query)
        
        # Insert assessment record
        response_json_str = json.dumps(item.responses_json)
        
        logger.info(f"Inserting assessment for user: {item.user_id}")
        query = assessments_table.insert().values(
            user_id=item.user_id,
            assessment_type=item.assessment_type,
            phq9_score=item.phq9_score,
            gad7_score=item.gad7_score,
            phq9_severity=item.phq9_severity,
            gad7_severity=item.gad7_severity,
            depression_severity=item.depression_severity,
            anxiety_severity=item.anxiety_severity,
            insomnia_severity=item.insomnia_severity,
            anger_severity=item.anger_severity,
            responses_json=response_json_str
        )
        assessment_id = await database.execute(query)
        logger.info(f"Assessment created with ID: {assessment_id}")
        
        # Insert individual responses
        response_values = item.responses_json
        question_ids = list(range(1, len(response_values) + 1))
        
        # Map response values to text options
        value_to_text = {0: "Not at all", 1: "Several days", 2: "More than half the days", 3: "Nearly every day"}
        
        logger.info(f"Inserting {len(response_values)} individual responses")
        for question_id, response_value in zip(question_ids, response_values):
            response_text = value_to_text.get(response_value, "Unknown")
            query = responses_table.insert().values(
                assessment_id=assessment_id,
                question_id=question_id,
                response_text=response_text,
                response_value=response_value
            )
            await database.execute(query)
        
        logger.info(f"Assessment submission successful for user: {item.user_id}")
        
        return {
            "success": True,
            "phq9_score": item.phq9_score,
            "gad7_score": item.gad7_score,
            "phq9_severity": item.phq9_severity,
            "gad7_severity": item.gad7_severity,
            "depression_severity": item.depression_severity,
            "anxiety_severity": item.anxiety_severity,
            "insomnia_severity": item.insomnia_severity,
            "anger_severity": item.anger_severity,
            "assessment_id": assessment_id,
            "message": "Assessment submitted successfully"
        }
    except Exception as e:
        logger.error(f"Error in create_item: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing assessment: {str(e)}")

@app.post("/openaitest/")
async def openai_test(request: openaichat):
    """
    OpenAI API integration endpoint (placeholder)
    """
    # TODO: Implement OpenAI API call here
    return {"summary": "AI-generated summary", "input": request.input}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Try to verify database connection
        query = "SELECT 1"
        await database.fetch_one(query)
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "error", "database": "disconnected", "error": str(e)}

