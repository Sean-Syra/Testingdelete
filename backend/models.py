from pydantic import BaseModel
from typing import List

class Item2(BaseModel):
    user_id: str
    assessment_type: str
    responses_json: List[int]
    total_score: int
    severity: str
    risk_flag: bool

class openaichat(BaseModel):
    input: str
