from pydantic import BaseModel, Field
from typing import List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from backend.ai.state import AgentState

# 1. The Output Schema for Risk
class RiskAnalysis(BaseModel):
    risk_score: int = Field(description="Risk severity out of 100 (Higher = More Risky).")
    top_risks: List[str] = Field(description="Top 3 critical risks or red flags.")
    opportunities: List[str] = Field(description="Potential mitigating factors or hidden opportunities.")
    evidence: List[dict] = Field(description="List of dictionaries with 'claim' and 'source_document'.")

def risk_agent(state: AgentState) -> AgentState:
    print("🚩 Risk Agent: Scanning for red flags...")
    
    docs = state.get("uploaded_documents", {})
    
    if not docs:
        print("No documents found. Skipping risk analysis.")
        return {"risk_analysis": {"error": "No data available"}}
    
    # The Risk Agent reads everything available
    raw_text = "\n\n".join([f"--- {name} ---\n{text}" for name, text in docs.items()])
    
    # Still using flash for speed and to stay safe on the free tier!
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1)
    structured_llm = llm.with_structured_output(RiskAnalysis)
    
    system_prompt = """You are a skeptical Venture Capital Risk Assessor.
    Review the provided startup documents and identify the biggest threats to their success.
    
    Look for:
    - High burn rates with short runways
    - Inexperienced or unbalanced founding teams
    - Crowded markets or weak competitive moats
    
    For your evidence array, cite exact phrases from the documents that prove these risks.
    """
    
    user_prompt = """Raw Documents:
    {raw_text}"""
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", user_prompt)
    ])
    
    chain = prompt | structured_llm
    result = chain.invoke({"raw_text": raw_text})
    
    # Format evidence for the shared state
    formatted_evidence = []
    for item in result.evidence:
        formatted_evidence.append({
            "claim": item.get("claim"),
            "source_document": item.get("source_document"),
            "agent": "Risk Agent"
        })
    
    print(f"✅ Risk Agent completed. Risk Severity: {result.risk_score}/100")
    
    # We map this directly to the fields we defined in state.py!
    return {
        "risk_analysis": {
            "score": result.risk_score,
        },
        "risks": result.top_risks,
        "opportunities": result.opportunities,
        "evidence": formatted_evidence,
        "agents_executed": ["risk_agent"]
    }