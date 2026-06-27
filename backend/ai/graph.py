from langgraph.graph import StateGraph, END
from backend.ai.state import AgentState
from backend.ai.planner import planner_agent
from backend.ai.agents.founder import founder_agent
from backend.ai.agents.financial import financial_agent # <-- ADD THIS
from backend.ai.agents.risk import risk_agent # <-- ADD THIS
# --- 1. The Routing Logic ---
def route_from_planner(state: AgentState):
    """
    This function looks at the list of agents the Planner decided to run.
    It returns the names of the nodes to execute next.
    """
    agents_to_run = state.get("agents_to_run", [])
    
    if not agents_to_run:
        print("⚠️ No agents routed. Ending workflow.")
        return END
    
    # For now, we only have the founder agent built. 
    # LangGraph allows returning a list of nodes to run them in parallel!
    # But for safety, we filter it to only nodes we've actually imported.
    next_nodes = []
    if "founder_agent" in agents_to_run:
        next_nodes.append("founder")
    if "financial_agent" in agents_to_run:       # <-- ADD THIS BLOCK
        next_nodes.append("financial")
    if "risk_agent" in agents_to_run:         # <-- ADD THIS BLOCK
        next_nodes.append("risk")
    # Later, you will add: if "pitch_deck_agent" in agents_to_run: next_nodes.append("pitch_deck")
    
    return next_nodes

# --- 2. Build the Graph ---
def build_graph():
    # Initialize the graph with our shared memory dictionary
    workflow = StateGraph(AgentState)
    
    # Add our nodes (the agents)
    workflow.add_node("planner", planner_agent)
    workflow.add_node("founder", founder_agent)
    workflow.add_node("financial", financial_agent)
    workflow.add_node("risk", risk_agent)
    
    # Define the flow
    # The workflow ALWAYS starts at the planner
    workflow.set_entry_point("planner")
    
    # After the planner runs, use our routing function to decide where to go
    workflow.add_conditional_edges(
        "planner",
        route_from_planner,
        # This dictionary maps the string returned by our router to the actual node name
        {"founder": "founder","financial": "financial","risk": "risk", END: END} 
    )
    
    # After the specialized agents finish, they should go to the end (for now)
    # Later, they will all route to the Recommendation Agent.
    workflow.add_edge("founder", END)
    workflow.add_edge("financial", END)
    workflow.add_edge("risk", END)

    # Compile the graph into an executable application
    return workflow.compile()

# --- 3. Local Testing Block ---
# This allows you to run this file directly in your terminal to test it!
if __name__ == "__main__":
    import os
    
    # NOTE: You MUST have your OpenAI API key set for this to work.
    # Run this in your terminal first: 
    # Windows PowerShell: $env:OPENAI_API_KEY="your-key-here"
    if not os.environ.get("OPENAI_API_KEY"):
        print("❌ ERROR: OPENAI_API_KEY is not set.")
        exit()

    app = build_graph()
    
    # Create some mock uploaded documents to trick the planner
    mock_state = {
        "uploaded_documents": {
            "Team_Resumes.pdf": "John Doe has 10 years of experience in healthcare tech and previously sold a startup to Google. Jane Smith is a brilliant AI researcher but has no business experience.",
            "Financials.csv": "Revenue: $0, Burn Rate: $50k/mo" # We haven't built the financial agent yet, so the planner should ignore this!
        }
    }
    
    print("\n🚀 Starting CatalystAI Execution...\n")
    
    # Run the graph!
    final_state = app.invoke(mock_state)
    
    print("\n🏁 Workflow Complete! Final State Output:")
    print("--------------------------------------------------")
    print(f"Agents Executed: {final_state.get('agents_executed')}")
    print(f"Founder Score: {final_state.get('founder_analysis', {}).get('score')}")
    print(f"Evidence Collected: {len(final_state.get('evidence', []))} items")
    print("--------------------------------------------------")