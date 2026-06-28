from typing import TypedDict, List, Dict, Any, Annotated, Literal
import operator

class AgentState(TypedDict):
    # --- 1. SYSTEM INPUTS ---
    uploaded_documents: Dict[str, str]
    
    # --- 2. ORCHESTRATION ---
    agents_to_run: List[str]
    agents_executed: Annotated[List[str], operator.add]
    
    # --- 3. THE ANALYSES ---
    startup_name: str
    industry: str
    startup_stage: str
    founder_analysis: Dict[str, Any]
    pitchdeck_analysis: Dict[str, Any]
    financial_analysis: Dict[str, Any]
    market_analysis: Dict[str, Any]
    risk_analysis: Dict[str, Any]
    
    # --- 4. THE OUTCOME ---
    risks: Annotated[List[str], operator.add]
    opportunities: Annotated[List[str], operator.add]
    missing_information: Annotated[List[str], operator.add]
    next_best_actions: Annotated[List[str], operator.add]
    
    recommendation: Literal["INVEST", "PASS", "HOLD", "INCOMPLETE", "PENDING"]
    confidence_score: int
    summary: str
    
    # --- 5. EXPLAINABILITY ---
    evidence: Annotated[List[Dict[str, str]], operator.add]
    
    # --- 6. HUMAN-IN-THE-LOOP & MEMORY ---
    human_review: Dict[str, Any]
    similar_cases: List[Dict[str, Any]]
    memory_updates: List[Dict[str, Any]]