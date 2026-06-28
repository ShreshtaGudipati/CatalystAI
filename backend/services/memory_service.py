from typing import List, Dict, Any
from backend.database import db

class MemoryService:
    @staticmethod
    def get_memory_timeline() -> List[Dict[str, Any]]:
        return db.get_all_memories()
