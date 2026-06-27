from typing import TypedDict, List, Dict, Any, Annotated, Literal
import operator

# Helper to append to lists instead of overwriting them
def add_logs(existing: List, new: List):
    return existing + new

class AgentState(TypedDict):
    # --- 1. SYSTEM INPUTS (What the user provides) ---
    uploaded_documents: Dict[str, str]  # e.g., {"pitch_deck.pdf": "raw text...", "financials.csv": "raw text..."}
    
    # --- 2. ORCHESTRATION (The Planner's Brain) ---
    agents_to_run: List[str]
    agents_executed: Annotated[List[str], add_logs]
    
    # --- 3. THE ANALYSES (Populated by specialized agents) ---
    startup_name: str
    industry: str
    founder_analysis: Dict[str, Any]
    financial_analysis: Dict[str, Any]
    market_analysis: Dict[str, Any]
    
    # --- 4. THE OUTCOME (Populated by the Recommendation Agent) ---
    risks: Annotated[List[str], add_logs]
    opportunities: Annotated[List[str], add_logs]
    missing_information: Annotated[List[str], add_logs]
    next_best_actions: Annotated[List[str], add_logs]
    
    recommendation: Literal["INVEST", "PASS", "HOLD", "INCOMPLETE", "PENDING"]
    confidence_score: int
    summary: str
    
    # --- 5. EXPLAINABILITY ---
    # Stores dicts like: {"claim": "...", "source": "...", "agent": "..."}
    evidence: Annotated[List[Dict[str, str]], add_logs]