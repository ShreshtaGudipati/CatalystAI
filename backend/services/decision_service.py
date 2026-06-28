import os
import uuid
from typing import Dict, Any, Optional
from backend.ai.graph import build_graph
from backend.database import db
from backend.config import UPLOAD_DIR

# Compile graph once
graph = build_graph()

class DecisionService:
    @staticmethod
    def extract_text_from_file(file_path: str) -> str:
        ext = os.path.splitext(file_path)[1].lower()
        try:
            if ext == '.pdf':
                from pypdf import PdfReader
                reader = PdfReader(file_path)
                text = ""
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text.strip() if text else f"[Empty PDF file: {os.path.basename(file_path)}]"
            elif ext in ['.txt', '.csv', '.json', '.xml', '.md']:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    return f.read().strip()
        except Exception as e:
            print(f"[DecisionService] Error extracting text from {file_path}: {e}")
        return f"[Content of {os.path.basename(file_path)} binary/unreadable file]"

    @staticmethod
    def create_decision_run(
        case_id: Optional[str],
        startup_name: Optional[str],
        industry: Optional[str],
        startup_stage: Optional[str]
    ) -> Dict[str, Any]:
        
        active_case_id = case_id if case_id else str(uuid.uuid4())
        case_dir = os.path.join(UPLOAD_DIR, active_case_id)
        
        uploaded_documents = {}
        if os.path.exists(case_dir):
            for filename in os.listdir(case_dir):
                file_path = os.path.join(case_dir, filename)
                # Extract actual text from uploaded PDF or files!
                text_content = DecisionService.extract_text_from_file(file_path)
                uploaded_documents[filename] = text_content
                
        initial_state = {
            "uploaded_documents": uploaded_documents,
            "startup_name": startup_name or "",
            "industry": industry or "",
            "startup_stage": startup_stage or "Seed",
            "agents_to_run": [],
            "agents_executed": [],
            "risks": [],
            "opportunities": [],
            "missing_information": [],
            "next_best_actions": [],
            "evidence": [],
            "similar_cases": [],
            "memory_updates": []
        }
        
        print(f"[DecisionService] Invoking LangGraph for case_id={active_case_id}")
        result = graph.invoke(initial_state)
        
        # Save decision case with status PENDING_REVIEW
        db.save_decision(active_case_id, result)
        
        # Inject decision_id into return
        result["decision_id"] = active_case_id
        return result

    @staticmethod
    def get_decision_details(decision_id: str) -> Optional[Dict[str, Any]]:
        state = db.get_decision(decision_id)
        if state:
            state["decision_id"] = decision_id
            return state
        return None
