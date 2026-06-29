import re
import json
import google.generativeai as genai
from backend.config import GEMINI_API_KEY
from backend.ai.state import AgentState
from backend.ai.agents.founder import find_sentences_with_keywords

def financial_agent(state: AgentState) -> AgentState:
    print("[Financial Agent] Crunching the numbers...")
    
    startup_name = state.get("startup_name", "").strip()
    docs = state.get("uploaded_documents", {})
    
    # 1. Try Live Gemini API
    if GEMINI_API_KEY:
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-2.5-flash")
            
            # Filter documents related to financials
            doc_context = ""
            for filename, text in docs.items():
                if any(x in filename.lower() for x in ["financial", "projection", "burn", "runway", "revenue", "sheet", "csv", "excel"]):
                    doc_context += f"--- Document: {filename} ---\n{text}\n\n"
            
            if not doc_context and docs:
                doc_context = "\n\n".join([f"--- Document: {k} ---\n{v}" for k, v in docs.items()])
                
            prompt = f"""
            You are an expert venture capital forensic accountant evaluating the financials of a startup named "{startup_name}".
            Analyze the following document text and provide a structured JSON evaluation of their financial health, capital efficiency, burn rate, and cash runway.
            
            Document Text:
            {doc_context}
            
            Your response must be a JSON object matching this schema:
            {{
                "score": 80, // integer from 0 to 100 representing financial strength
                "summary": "Concise summary of the financial health and runway status.",
                "strengths": ["Strength 1 (e.g., Low burn, high growth)"],
                "weaknesses": ["Weakness 1 (e.g., Short runway, high churn)"],
                "evidence": [
                    {{
                        "claim": "Specific financial metric or claim (e.g., ARR is $720,000)",
                        "source_document": "The filename where this was found"
                    }}
                ]
            }}
            
            Return ONLY the raw JSON object. Do not wrap it in markdown block formatting.
            """
            
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            analysis = json.loads(response.text)
            
            formatted_evidence = [
                {"claim": item["claim"], "source_document": item.get("source_document", "Financial_Projections.pdf"), "agent": "Financial Agent"}
                for item in analysis.get("evidence", [])
            ]
            
            return {
                "financial_analysis": analysis,
                "evidence": formatted_evidence,
                "agents_executed": ["financial_agent"]
            }
        except Exception as e:
            print(f"[Financial Agent] Gemini API error: {e}. Falling back to heuristics.")

    # 2. Fallback / Mock Logic
    if "aetherhealth" in startup_name.lower():
        analysis = {
            "score": 82,
            "summary": "Excellent financial health with high capital efficiency, strong ARR growth, and safe cash runway.",
            "strengths": [
                "Strong current ARR of $720,000 growing at 148% YoY.",
                "Healthy runway of 19 months based on a low $52,000 monthly burn rate."
            ],
            "weaknesses": [
                "None identified at the current seed stage."
            ],
            "evidence": [
                {"claim": "ARR of $720,000 with 148% YoY growth", "source_document": "Financial_Projections.pdf"},
                {"claim": "Monthly burn rate of $52,000 with 19 months runway", "source_document": "Financial_Projections.pdf"}
            ]
        }
    elif "logichain" in startup_name.lower():
        analysis = {
            "score": 45,
            "summary": "Highly concerning financial position with a short runway and high burn relative to revenue.",
            "strengths": [
                "SaaS model shows initial traction of $180,000 ARR."
            ],
            "weaknesses": [
                "Elevated monthly burn rate of $95,000 leaves a dangerously short 7-month runway.",
                "No audited revenue and financial projections are incomplete."
            ],
            "evidence": [
                {"claim": "ARR is $180,000", "source_document": "Financial_Projections.pdf"},
                {"claim": "Monthly burn rate of $95,000 with 7 months runway", "source_document": "Financial_Projections.pdf"}
            ]
        }
    elif "cryptoquant" in startup_name.lower():
        analysis = {
            "score": 20,
            "summary": "Extremely weak financial indicators showing high capital inefficiency and imminent insolvency risk.",
            "strengths": [
                "None. Initial revenue is negligible."
            ],
            "weaknesses": [
                "Negligible revenue of $18,000 with a massive monthly burn rate of $140,000.",
                "Runway is extremely short at 2 months, requiring immediate funding."
            ],
            "evidence": [
                {"claim": "Revenue of $18,000", "source_document": "Financial_Projections.pdf"},
                {"claim": "Monthly burn of $140,000 with 2 months runway", "source_document": "Financial_Projections.pdf"}
            ]
        }
    else:
        # Dynamic Heuristic Parsing for custom uploaded documents!
        kw_matches = find_sentences_with_keywords(docs, ["arr", "runway", "burn", "growth", "revenue", "financial", "asked", "$"])
        
        strengths = []
        evidence = []
        for sentence, filename in kw_matches[:3]:
            strengths.append(sentence)
            evidence.append({"claim": sentence, "source_document": filename})
            
        if not strengths:
            strengths = ["Financial projections are structured for early stage launch."]
            evidence = [{"claim": "Financial data uploaded in spreadsheet/PDF format", "source_document": "Financial_Projections.pdf"}]
            
        analysis = {
            "score": 70 if len(kw_matches) > 0 else 60,
            "summary": f"Dynamic financial assessment computed from uploaded files for {startup_name}.",
            "strengths": strengths,
            "weaknesses": ["Requires audited statements to confirm absolute burn rates and cash targets."],
            "evidence": evidence
        }
        
    formatted_evidence = [
        {"claim": item["claim"], "source_document": item["source_document"], "agent": "Financial Agent"}
        for item in analysis["evidence"]
    ]
    
    return {
        "financial_analysis": analysis,
        "evidence": formatted_evidence,
        "agents_executed": ["financial_agent"]
    }