from typing import List
from backend.ai.state import AgentState
from backend.database import db

def planner_agent(state: AgentState) -> AgentState:
    print("[Planner] Analyzing uploaded documents and searching memory...")
    
    # 1. Infer startup info from documents or use defaults
    uploaded_docs = state.get("uploaded_documents", {})
    startup_name = state.get("startup_name", "")
    industry = state.get("industry", "")
    stage = state.get("startup_stage", "Seed")
    
    # Fallback/default logic for demo purposes
    if not startup_name:
        startup_name = "HealthAI"
    if not industry:
        # Infer industry from document names if possible
        doc_names = "".join(uploaded_docs.keys()).lower()
        if "health" in doc_names or "medical" in doc_names:
            industry = "Healthcare"
        elif "finance" in doc_names or "fintech" in doc_names:
            industry = "Fintech"
        else:
            industry = "Healthcare"  # Default demo industry
            
    print(f"[Planner] Identified Startup: {startup_name} | Industry: {industry} | Stage: {stage}")
    
    # 2. Query History/Memory for similar cases first (Memory runs first!)
    similar_cases = db.search_memories(industry)
    print(f"[Planner] Retrieve Memory: Found {len(similar_cases)} similar past investments in {industry}")
    
    # 3. Dynamic Orchestration based on present files
    agents_to_run = ["risk_agent"]  # Always run risk agent
    
    doc_keys = [k.lower() for k in uploaded_docs.keys()]
    
    # Check for pitch deck
    if any("pitch" in k or "deck" in k for k in doc_keys) or len(uploaded_docs) == 0:
        agents_to_run.append("pitchdeck_agent")
    else:
        print("Planner: Pitch deck missing. Skipping PitchDeck Agent.")
        
    # Check for founder files
    if any("resume" in k or "team" in k or "profile" in k for k in doc_keys) or len(uploaded_docs) == 0:
        agents_to_run.append("founder_agent")
    else:
        print("Planner: Resumes missing. Skipping Founder Agent.")
        
    # Check for financial files
    if any("financial" in k or "projection" in k or "csv" in k for k in doc_keys) or len(uploaded_docs) == 0:
        agents_to_run.append("financial_agent")
    else:
        print("Planner: Financial projections missing. Skipping Financial Agent.")
        
    # Check for market reports
    if any("market" in k or "report" in k for k in doc_keys) or len(uploaded_docs) == 0:
        agents_to_run.append("market_agent")
    else:
        print("Planner: Market reports missing. Skipping Market Agent.")
        
    print(f"[Planner] Decided to execute: {agents_to_run}")
    
    return {
        "startup_name": startup_name,
        "industry": industry,
        "startup_stage": stage,
        "agents_to_run": agents_to_run,
        "similar_cases": similar_cases,
        "evidence": [],
        "agents_executed": ["planner_agent"]
    }