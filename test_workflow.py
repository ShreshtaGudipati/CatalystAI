import os
import shutil
import sys

# Add current directory to path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.ai.graph import build_graph
from backend.database import db
from backend.ai.memory import MemoryManager

def run_integration_test():
    print("=== STARTING CATALYSTAI WORKFLOW INTEGRATION TEST ===")
    
    # 1. Clean database file
    db_path = db.DB_PATH
    if os.path.exists(db_path):
        print(f"Cleaning database file at {db_path}...")
        os.remove(db_path)
        
    db.init_db()
    
    # 2. Build graph
    graph = build_graph()
    print("[OK] StateGraph compiled successfully.")
    
    # ----------------------------------------------------
    # TEST CASE 1: AetherHealth AI (INVEST, 94%)
    # ----------------------------------------------------
    print("\n--- Running Case 1: AetherHealth AI ---")
    state_1 = {
        "uploaded_documents": {
            "Pitch_Deck.pdf": "Real-time ICU prediction platform.",
            "Founder_Profile.pdf": "CEO Aarav Mehta PhD, Kavya Raman ex-MSFT.",
            "Financial_Projections.pdf": "ARR: $720k, Burn: $52k, Runway: 19mo.",
            "Market_Research_Report.pdf": "TAM: $18B. CAGR: 29%."
        },
        "startup_name": "AetherHealth AI",
        "industry": "Healthcare",
        "startup_stage": "Seed",
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
    
    res_1 = graph.invoke(state_1)
    
    print(f"  AI Rec: {res_1.get('recommendation')} | Conf: {res_1.get('confidence_score')}%")
    assert res_1.get('recommendation') == 'INVEST'
    assert res_1.get('confidence_score') == 94
    print("  [OK] Case 1 Recommendation & Confidence are perfect.")
    
    # Simulate Human Review Approval
    case_id_1 = "case_01_aetherhealth"
    res_1["human_review"] = {
        "status": "APPROVED",
        "reviewer": "Jane Doe",
        "comments": "Healthcare founders with medical domain expertise showed higher success.",
        "decision": "APPROVED",
        "timestamp": "2026-06-28 10:00:00"
    }
    
    mem_1 = MemoryManager.store_lesson(res_1, res_1["human_review"]["comments"], "Jane Doe")
    res_1["memory_updates"].append(mem_1)
    db.save_decision(case_id_1, res_1)
    print("  [OK] Case 1 saved to Database and memory logged.")
    
    # ----------------------------------------------------
    # TEST CASE 2: LogiChain Solutions (HOLD, 71%)
    # ----------------------------------------------------
    print("\n--- Running Case 2: LogiChain Solutions ---")
    state_2 = {
        "uploaded_documents": {
            "Pitch_Deck.pdf": "SCM demand forecasting.",
            "Founder_Profile.pdf": "CEO Rohan Iyer, ex-Amazon SCM.",
            "Financial_Projections.pdf": "ARR: $180k. Burn: $95k. Runway: 7mo."
        },
        "startup_name": "LogiChain Solutions",
        "industry": "Supply Chain AI",
        "startup_stage": "Seed",
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
    
    res_2 = graph.invoke(state_2)
    print(f"  AI Rec: {res_2.get('recommendation')} | Conf: {res_2.get('confidence_score')}%")
    assert res_2.get('recommendation') == 'HOLD'
    assert res_2.get('confidence_score') == 71
    print("  [OK] Case 2 Recommendation & Confidence are perfect.")
    
    # Simulate Human Review loop Needs More Information
    case_id_2 = "case_02_logichain"
    res_2["human_review"] = {
        "status": "NEEDS_REVIEW",
        "reviewer": "Jane Doe",
        "comments": "Supply Chain startups with runway under 9 months require additional financial validation.",
        "decision": "NEEDS_REVIEW",
        "timestamp": "2026-06-28 10:30:00"
    }
    mem_2 = MemoryManager.store_lesson(res_2, res_2["human_review"]["comments"], "Jane Doe")
    res_2["memory_updates"].append(mem_2)
    db.save_decision(case_id_2, res_2)
    print("  [OK] Case 2 saved to Database and memory logged.")
    
    # ----------------------------------------------------
    # TEST CASE 3: CryptoQuant Labs (PASS, 91%)
    # ----------------------------------------------------
    print("\n--- Running Case 3: CryptoQuant Labs ---")
    state_3 = {
        "uploaded_documents": {
            "Pitch_Deck.pdf": "We will dominate crypto trading.",
            "Founder_Profile.pdf": "CEO Aditya Kapoor, CS Fresh Graduate.",
            "Financial_Projections.pdf": "ARR: $18k. Burn: $140k. Runway: 2mo."
        },
        "startup_name": "CryptoQuant Labs",
        "industry": "Crypto",
        "startup_stage": "Seed",
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
    
    res_3 = graph.invoke(state_3)
    print(f"  AI Rec: {res_3.get('recommendation')} | Conf: {res_3.get('confidence_score')}%")
    assert res_3.get('recommendation') == 'PASS'
    assert res_3.get('confidence_score') == 91
    print("  [OK] Case 3 Recommendation & Confidence are perfect.")
    
    # Simulate Human Review loop
    case_id_3 = "case_03_cryptoquant"
    res_3["human_review"] = {
        "status": "REJECTED",
        "reviewer": "Jane Doe",
        "comments": "Crypto startups without product-market fit have historically underperformed.",
        "decision": "REJECTED",
        "timestamp": "2026-06-28 11:00:00"
    }
    mem_3 = MemoryManager.store_lesson(res_3, res_3["human_review"]["comments"], "Jane Doe")
    res_3["memory_updates"].append(mem_3)
    db.save_decision(case_id_3, res_3)
    print("  [OK] Case 3 saved to Database and memory logged.")

    # ----------------------------------------------------
    # TEST MEMORY RETRIEVAL FOR DYNAMIC PLANNING
    # ----------------------------------------------------
    print("\n--- Running Phase 4: Secondary Run and Memory Retrieval Check ---")
    state_4 = {
        "uploaded_documents": {
            "Pitch_Deck.pdf": "AetherHealth AI second product edition."
        },
        "startup_name": "AetherHealth Pro",
        "industry": "Healthcare",  # Same industry as Case 1!
        "startup_stage": "Seed",
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
    
    res_4 = graph.invoke(state_4)
    sim_cases = res_4.get("similar_cases", [])
    print(f"  Retrieved matching memory count: {len(sim_cases)}")
    assert len(sim_cases) > 0, "Memory retrieval failed!"
    print("  Found lessons:")
    for c in sim_cases:
        print(f"    - [{c['human_decision']}] Pattern: {c['pattern']} | Lesson: {c['learning']}")
        
    print("\n=== INTEGRATION TEST COMPLETED SUCCESSFULLY! ===")

if __name__ == "__main__":
    run_integration_test()
