from typing import Dict, Any, List
from backend.database import db
from datetime import datetime

class MemoryManager:
    """
    Memory Manager Service to search, store, and update pattern-based decision lessons.
    """
    
    @staticmethod
    def retrieve_similar_cases(industry: str) -> List[Dict[str, Any]]:
        """
        Retrieves historical lessons in similar industry.
        """
        return db.search_memories(industry)
    
    @staticmethod
    def store_lesson(state: Dict[str, Any], comments: str, reviewer: str, timestamp: str = None) -> Dict[str, Any]:
        """
        Stores a standardized pattern lesson after human approval/decision.
        """
        recommendation = state.get("recommendation", "HOLD")
        decision = state.get("human_review", {}).get("decision", "APPROVE")
        industry = state.get("industry", "Healthcare")
        stage = state.get("startup_stage", "Seed")
        
        # Determine the pattern and learning based on the decision and comments
        pattern = f"Startup in {industry} stage {stage} evaluated with AI recommendation {recommendation}"
        learning = comments if comments else f"Approved {recommendation} decision for {state.get('startup_name', 'startup')}"
        
        # Standard lesson schema
        memory_entry = {
            "industry": industry,
            "startup_stage": stage,
            "pattern": pattern,
            "ai_recommendation": recommendation,
            "human_decision": decision,
            "outcome": "Decision Logged",
            "learning": learning,
            "timestamp": timestamp if timestamp else datetime.now().strftime("%Y-%m-%d")
        }
        
        db.save_memory(memory_entry)
        return memory_entry