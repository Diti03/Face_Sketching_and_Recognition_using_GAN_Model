from pydantic import BaseModel
from typing import List

# Request model
class MatchRequest(BaseModel):
    sketch_id: int
    top_k: int = 3  # number of matches to return

# Model for a single match
class MatchResult(BaseModel):
    image_url: str
    similarity_score: float

# Response model
class MatchResponse(BaseModel):
    matches: List[MatchResult]
