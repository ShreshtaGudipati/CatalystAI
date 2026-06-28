from fastapi import APIRouter, HTTPException
from backend.database.schemas import AnalysisRequest
from backend.services.decision_service import DecisionService

router = APIRouter(tags=["Analysis"])

@router.post("/analyze")
async def analyze_startup(request: AnalysisRequest):
    """
    Triggers dynamic planning and agent execution in the graph.
    """
    try:
        return DecisionService.create_decision_run(
            case_id=request.case_id,
            startup_name=request.startup_name,
            industry=request.industry,
            startup_stage=request.startup_stage
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/decision/{decision_id}")
async def get_decision_details(decision_id: str):
    """
    Fetches full state analysis by case ID.
    """
    details = DecisionService.get_decision_details(decision_id)
    if not details:
        raise HTTPException(status_code=404, detail="Decision case not found")
    return details
