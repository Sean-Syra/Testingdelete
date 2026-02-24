from pydantic import BaseModel
from typing import List

class Item2(BaseModel):
    user_id: str
    user_name: str
    user_email: str
    assessment_type: str
    responses_json: List[int]
    phq9_score: int
    gad7_score: int
    phq9_severity: str
    gad7_severity: str
    depression_severity: str
    anxiety_severity: str
    insomnia_severity: str
    anger_severity: str

class openaichat(BaseModel):
    input: str

