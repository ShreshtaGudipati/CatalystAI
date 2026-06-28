from fastapi import APIRouter
from backend.services.knowledge_service import KnowledgeService

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base"])

@router.get("")
async def get_knowledge():
    """
    Returns pre-populated VC guides, playbooks, and policy criteria.
    """
    return KnowledgeService.get_knowledge_base()
