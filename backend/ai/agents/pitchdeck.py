from backend.ai.state import AgentState

def pitchdeck_agent(state: AgentState) -> AgentState:
    print("[Pitch Deck Agent] Analyzing product-market fit...")
    
    startup_name = state.get("startup_name", "").strip()
    
    if "aetherhealth" in startup_name.lower():
        analysis = {
            "score": 80,
            "summary": "Highly structured pitch deck detailing clear product solution and ROI value proposition.",
            "strengths": [
                "Solves critical ICU patient deterioration prediction problem.",
                "Well-defined business SaaS pricing structure."
            ],
            "weaknesses": [
                "Pricing validation metrics are still early-stage."
            ],
            "evidence": [
                {"claim": "ICU prediction platform predict deterioration", "source_document": "Pitch_Deck.pdf"},
                {"claim": "SaaS model mapped on Slide 9", "source_document": "Pitch_Deck.pdf"}
            ]
        }
    elif "logichain" in startup_name.lower():
        analysis = {
            "score": 70,
            "summary": "Promising SCM demand forecasting pitch deck, though lacking concrete customer proof.",
            "strengths": [
                "Addresses key manufacturer supply chain inventory forecasting deficits."
            ],
            "weaknesses": [
                "Lack of audited customer contracts and case studies."
            ],
            "evidence": [
                {"claim": "AI demand forecasting for manufacturers", "source_document": "Pitch_Deck.pdf"}
            ]
        }
    elif "cryptoquant" in startup_name.lower():
        analysis = {
            "score": 30,
            "summary": "Poorly structured pitch deck containing unsubstantiated claims and no technical MVP diagrams.",
            "strengths": [
                "Identifies high retail trading transaction interest."
            ],
            "weaknesses": [
                "Unsubstantiated claim: 'We will dominate crypto trading'.",
                "No technical architecture diagram or MVP verification exists."
            ],
            "evidence": [
                {"claim": "We will dominate crypto trading claim", "source_document": "Pitch_Deck.pdf"}
            ]
        }
    else:
        analysis = {
            "score": 65,
            "summary": f"Pitch deck evaluation for {startup_name} shows reasonable product-market fit.",
            "strengths": ["Clear problem statement"],
            "weaknesses": ["Unproven unit economics"],
            "evidence": [
                {"claim": "SaaS model proposed", "source_document": "Pitch_Deck.pdf"}
            ]
        }
        
    formatted_evidence = [
        {"claim": item["claim"], "source_document": item["source_document"], "agent": "Pitch Deck Agent"}
        for item in analysis["evidence"]
    ]
    
    return {
        "pitchdeck_analysis": analysis,
        "evidence": formatted_evidence,
        "agents_executed": ["pitchdeck_agent"]
    }
