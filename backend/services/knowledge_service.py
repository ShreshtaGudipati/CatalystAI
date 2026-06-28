from typing import List, Dict, Any
from backend.database import db

class KnowledgeService:
    @staticmethod
    def get_knowledge_base() -> List[Dict[str, Any]]:
        return db.get_knowledge_documents()
