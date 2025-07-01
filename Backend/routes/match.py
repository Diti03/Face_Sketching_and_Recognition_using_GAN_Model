# routes/match.py

from fastapi import APIRouter, HTTPException
from models.match_model import MatchRequest, MatchResponse, MatchResult
from supabase_client import supabase

router = APIRouter()

@router.post("/", response_model=MatchResponse)
def match_faces(request: MatchRequest):
    # Fetch the match_results where id == sketch_id
    result = supabase.table("match_results").select("*").eq("id", request.sketch_id).execute()

    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="No match results found for this sketch.")

    match_data = result.data[0]

    # Prepare matches for the response
    matches = [
        MatchResult(image_url=match_data["match_1_url"], similarity_score=match_data["score_1"]),
        MatchResult(image_url=match_data["match_2_url"], similarity_score=match_data["score_2"]),
        MatchResult(image_url=match_data["match_3_url"], similarity_score=match_data["score_3"]),
    ]

    return MatchResponse(matches=matches)

@router.get("/latest", response_model=MatchResponse)
def get_latest_match_results():
    # Fetch latest match_result by descending order of id (assuming higher id = latest)
    result = (
        supabase.table("match_results")
        .select("*")
        .order("id", desc=True)
        .limit(1)
        .execute()
    )

    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="No match results found.")

    match_data = result.data[0]

    # Prepare matches for the response
    matches = [
        MatchResult(image_url=match_data["match_1_url"], similarity_score=match_data["score_1"]),
        MatchResult(image_url=match_data["match_2_url"], similarity_score=match_data["score_2"]),
        MatchResult(image_url=match_data["match_3_url"], similarity_score=match_data["score_3"]),
    ]

    return MatchResponse(matches=matches)
