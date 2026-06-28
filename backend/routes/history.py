from fastapi import APIRouter
from backend.services.history_service import HistoryService

router = APIRouter(prefix="/history", tags=["History"])

@router.get("")
async def get_history():
    """
    Fetches the timeline list of all historical decisions.
    """
    return HistoryService.get_decision_history()
