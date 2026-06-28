from typing import List, Dict, Any
from backend.database import db

class HistoryService:
    @staticmethod
    def get_decision_history() -> List[Dict[str, Any]]:
        return db.get_all_decisions()
