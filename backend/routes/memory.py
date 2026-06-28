from fastapi import APIRouter
from backend.services.memory_service import MemoryService

router = APIRouter(prefix="/memory", tags=["Memory Center"])

@router.get("")
async def get_memories():
    """
    Returns historical learning lessons logged from human feedback.
    """
    return MemoryService.get_memory_timeline()
