from pydantic import BaseModel, Field
from typing import List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from backend.ai.state import AgentState

# 1. The Output Schema for Financials
class FinancialAnalysis(BaseModel):
    score: int = Field(description="Score out of 100 based on financial health and projections.")
    burn_rate: str = Field(description="Estimated monthly burn rate (e.g., '$50k/mo').")
    runway: str = Field(description="Estimated runway in months (e.g., '12 months').")
    strengths: List[str] = Field(description="Top 2 financial strengths.")
    weaknesses: List[str] = Field(description="Top 2 financial weaknesses or red flags.")
    evidence: List[dict] = Field(description="List of dictionaries with 'claim' and 'source_document'.")

def financial_agent(state: AgentState) -> AgentState:
    print("📊 Financial Agent: Crunching the numbers...")
    
    docs = state.get("uploaded_documents", {})
    
    # Only grab documents that sound like financials
    fin_docs = {name: text for name, text in docs.items() if "financial" in name.lower() or "csv" in name.lower() or "projection" in name.lower()}
    
    if not fin_docs:
        print("No financial documents found. Skipping analysis.")
        return {"financial_analysis": {"error": "No data available"}}
    
    raw_text = "\n\n".join([f"--- {name} ---\n{text}" for name, text in fin_docs.items()])
    
    # We stick with 'flash' to stay safely inside your free tier API limits!
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    structured_llm = llm.with_structured_output(FinancialAnalysis)
    
    system_prompt = """You are a highly analytical Venture Capital CFO evaluating startup financials.
    Read the provided financial statements, projections, or cap tables.
    
    Extract the burn rate and runway if available.
    Evaluate their revenue growth, margins, and capital efficiency.
    
    For your evidence array, cite exact numbers and phrases from the document.
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
            "agent": "Financial Agent"
        })
    
    print(f"✅ Financial Agent completed. Score: {result.score}/100")
    
    return {
        "financial_analysis": {
            "score": result.score,
            "burn_rate": result.burn_rate,
            "runway": result.runway,
            "strengths": result.strengths,
            "weaknesses": result.weaknesses
        },
        "evidence": formatted_evidence,
        "agents_executed": ["financial_agent"]
    }