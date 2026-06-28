from langgraph.graph import StateGraph, END
from langgraph.types import Send
from backend.ai.state import AgentState
from backend.ai.planner import planner_agent
from backend.ai.agents.founder import founder_agent
from backend.ai.agents.financial import financial_agent
from backend.ai.agents.risk import risk_agent
from backend.ai.agents.pitchdeck import pitchdeck_agent
from backend.ai.agents.market import market_agent
from backend.ai.agents.recommendation import recommendation_agent

# --- 1. The Routing Logic ---
def route_from_planner(state: AgentState):
    """
    Dynamically routes to all requested agents using the Send API.
    Matches planner keys to graph node names.
    """
    agents_to_run = state.get("agents_to_run", [])
    
    # These keys MUST match the strings output by your planner_agent
    mapping = {
        "pitchdeck_agent": "pitchdeck",
        "founder_agent": "founder",
        "market_agent": "market",
        "financial_agent": "financial",
        "risk_agent": "risk"
    }
    
    # Return a list of 'Send' objects to trigger agents in parallel
    return [Send(mapping[agent], state) for agent in agents_to_run if agent in mapping]

# --- 2. Build the Graph ---
def build_graph():
    workflow = StateGraph(AgentState)
    
    # Add Nodes
    workflow.add_node("planner", planner_agent)
    workflow.add_node("pitchdeck", pitchdeck_agent)
    workflow.add_node("founder", founder_agent)
    workflow.add_node("financial", financial_agent)
    workflow.add_node("risk", risk_agent)
    workflow.add_node("market", market_agent)
    workflow.add_node("recommendation", recommendation_agent)
    
    # Define Flow
    workflow.set_entry_point("planner")
    
    # Use Send API for parallel branching
    workflow.add_conditional_edges("planner", route_from_planner)
    
    # Route all specialized agents to Recommendation
    workflow.add_edge("pitchdeck", "recommendation")
    workflow.add_edge("founder", "recommendation")
    workflow.add_edge("financial", "recommendation")
    workflow.add_edge("risk", "recommendation")
    workflow.add_edge("market", "recommendation")
    
    # Final step goes directly to END
    workflow.add_edge("recommendation", END)
    
    return workflow.compile()