from typing import List, Dict, Any, Optional
from backend.database import db

class EvidenceService:
    @staticmethod
    def get_decision_evidence(decision_id: str) -> List[Dict[str, Any]]:
        state = db.get_decision(decision_id)
        if state:
            return state.get("evidence", [])
        return []
