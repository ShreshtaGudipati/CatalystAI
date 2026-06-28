import datetime
from typing import Dict, Any, Optional
from backend.database import db
from backend.ai.memory import MemoryManager

class ApprovalService:
    @staticmethod
    def submit_approval(
        decision_id: str,
        status: str,
        comments: str,
        reviewer: str
    ) -> Optional[Dict[str, Any]]:
        
        state = db.get_decision(decision_id)
        if not state:
            return None
            
        # Update human_review details
        state["human_review"] = {
            "status": status,
            "reviewer": reviewer,
            "comments": comments,
            "decision": status,
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Save structured lesson pattern to Memory Center post-approval (Step 10)
        memory_entry = MemoryManager.store_lesson(
            state=state,
            comments=comments,
            reviewer=reviewer
        )
        
        state["memory_updates"].append(memory_entry)
        
        # Save updated decision
        db.save_decision(decision_id, state)
        
        state["decision_id"] = decision_id
        return state
