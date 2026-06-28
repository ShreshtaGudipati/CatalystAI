from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class AnalysisRequest(BaseModel):
    case_id: Optional[str] = None
    startup_name: Optional[str] = None
    industry: Optional[str] = None
    startup_stage: Optional[str] = "Seed"

class ApprovalRequest(BaseModel):
    decision_id: str
    status: str  # APPROVED, REJECTED, NEEDS_REVIEW
    comments: str
    reviewer: str

class DecisionSummary(BaseModel):
    id: str
    startup_name: str
    industry: str
    status: str
    recommendation: str
    confidence_score: int
    created_at: str

class MemoryItem(BaseModel):
    industry: str
    startup_stage: str
    pattern: str
    ai_recommendation: str
    human_decision: str
    outcome: str
    learning: str
    timestamp: str

class KnowledgeItem(BaseModel):
    id: int
    title: str
    category: str
    content: str
    updated_at: str
