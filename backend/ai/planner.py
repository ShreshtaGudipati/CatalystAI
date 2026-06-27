from typing import List
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
# --- NEW GOOGLE IMPORT ---
from langchain_google_genai import ChatGoogleGenerativeAI
from backend.ai.state import AgentState

class PlannerOutput(BaseModel):
    agents_to_run: List[str] = Field(
        description="List of agent names to execute. Options: 'pitch_deck_agent', 'founder_agent', 'financial_agent', 'market_agent', 'risk_agent'"
    )

def planner_agent(state: AgentState) -> AgentState:
    print("🧠 Planner Agent: Analyzing uploaded documents...")
    
    documents = state.get("uploaded_documents", {})
    doc_summary = "\n".join([f"- {doc_name}" for doc_name in documents.keys()])
    
    # --- NEW GEMINI SETUP ---
    # Using 'gemini-1.5-flash' because the planner needs to be fast and cheap
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    structured_llm = llm.with_structured_output(PlannerOutput)
    
    system_prompt = """You are the orchestration engine for a Venture Capital Due Diligence platform.
    Your job is to look at the documents provided by the user and decide which analysis agents need to run.
    
    Available Agents and Triggers:
    - 'pitch_deck_agent': Run if a pitch deck, presentation, or business plan is uploaded.
    - 'founder_agent': Run if a resume, LinkedIn profile, or team document is uploaded.
    - 'financial_agent': Run if financial statements, cap tables, or projections (Excel/CSV) are uploaded.
    - 'market_agent': Run if a market research report or competitor analysis is uploaded.
    - 'risk_agent': ALWAYS run this agent last to evaluate the findings."""
    
    user_prompt = """User uploaded the following documents:
    {doc_summary}
    
    Return ONLY the list of agents that should execute."""
    
    # We now pass both the system instructions and the human input
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", user_prompt)
    ])
    
    chain = prompt | structured_llm
    result = chain.invoke({"doc_summary": doc_summary})
    
    print(f"🎯 Planner decided to route to: {result.agents_to_run}")
    return {"agents_to_run": result.agents_to_run}