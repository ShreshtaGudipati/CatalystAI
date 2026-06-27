from pydantic import BaseModel, Field
from typing import List
# --- NEW GOOGLE IMPORT ---
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from backend.ai.state import AgentState

class FounderAnalysis(BaseModel):
    score: int = Field(description="Score out of 100 based on experience and domain knowledge.")
    experience_summary: str = Field(description="A brief 2-sentence summary of their background.")
    strengths: List[str] = Field(description="Top 3 strengths of the founding team.")
    weaknesses: List[str] = Field(description="Top 3 weaknesses or red flags.")
    evidence: List[dict] = Field(description="List of dictionaries with 'claim' and 'source_document'.")

def founder_agent(state: AgentState) -> AgentState:
    print("🕵️‍♂️ Founder Agent: Evaluating team background...")
    
    docs = state.get("uploaded_documents", {})
    team_docs = {name: text for name, text in docs.items() if "resume" in name.lower() or "team" in name.lower()}
    
    if not team_docs:
        print("No founder documents found. Skipping analysis.")
        return {"founder_analysis": {"error": "No data available"}}
    
    raw_text = "\n\n".join([f"--- {name} ---\n{text}" for name, text in team_docs.items()])
    
    # --- NEW GEMINI SETUP ---
    # Using 'gemini-1.5-pro' because the analysis agent requires deep reasoning
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
    structured_llm = llm.with_structured_output(FounderAnalysis)
    
    system_prompt = """You are a ruthless but fair Venture Capital analyst specializing in evaluating startup founders.
    Read the provided resumes or team profiles and evaluate their likelihood of success.
    
    Look for:
    - Previous exits or startup experience (High positive impact on score)
    - Domain expertise in the industry they are building for
    - Technical vs Business balance
    
    For your evidence array, cite exact phrases from the document that justify your strengths/weaknesses."""
    
    user_prompt = """Raw Documents:
    {raw_text}"""
    
    # Split into system rules and human data
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", user_prompt)
    ])
    chain = prompt | structured_llm
    
    result = chain.invoke({"raw_text": raw_text})
    
    formatted_evidence = []
    for item in result.evidence:
        formatted_evidence.append({
            "claim": item.get("claim"),
            "source_document": item.get("source_document"),
            "agent": "Founder Agent"
        })
    
    print(f"✅ Founder Agent completed. Score: {result.score}/100")
    
    return {
        "founder_analysis": {
            "score": result.score,
            "experience": result.experience_summary,
            "strengths": result.strengths,
            "weaknesses": result.weaknesses
        },
        "evidence": formatted_evidence,
        "agents_executed": ["founder_agent"] 
    }