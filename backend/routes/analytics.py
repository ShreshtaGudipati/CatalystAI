from fastapi import APIRouter
from backend.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("")
async def get_analytics():
    """
    Computes aggregations (Approved, Rejected, Avg Confidence, Risk Distributions) for display.
    """
    return AnalyticsService.get_analytics_dashboard()
