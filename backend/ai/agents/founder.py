import re
import json
import google.generativeai as genai
from backend.config import GEMINI_API_KEY
from backend.ai.state import AgentState

def find_sentences_with_keywords(docs: dict, keywords: list) -> list:
    results = []
    for filename, text in docs.items():
        if not text:
            continue
        # Simple sentence splitter
        sentences = re.split(r'(?<=[.!?])\s+', text)
        for sentence in sentences:
            for kw in keywords:
                if kw.lower() in sentence.lower() and len(sentence.strip()) > 10:
                    results.append((sentence.strip(), filename))
                    break
    return results

def founder_agent(state: AgentState) -> AgentState:
    print("[Founder Agent] Evaluating team background...")
    
    startup_name = state.get("startup_name", "").strip()
    docs = state.get("uploaded_documents", {})
    
    # 1. Try Live Gemini API
    if GEMINI_API_KEY:
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-2.5-flash")
            
            # Filter documents related to the founder resumes/profiles
            doc_context = ""
            for filename, text in docs.items():
                if any(x in filename.lower() for x in ["founder", "team", "profile", "resume", "cv", "bio"]):
                    doc_context += f"--- Document: {filename} ---\n{text}\n\n"
            
            if not doc_context and docs:
                doc_context = "\n\n".join([f"--- Document: {k} ---\n{v}" for k, v in docs.items()])
                
            prompt = f"""
            You are an expert venture capital analyst evaluating the founding team of a startup named "{startup_name}".
            Analyze the following document text and provide a structured JSON evaluation of their backgrounds, education, experience, and execution capabilities.
            
            Document Text:
            {doc_context}
            
            Your response must be a JSON object matching this schema:
            {{
                "score": 90, // integer from 0 to 100 representing team strength
                "summary": "Concise summary of the team's strengths and weaknesses.",
                "strengths": ["Strength 1", "Strength 2"],
                "weaknesses": ["Weakness 1", "Weakness 2"],
                "evidence": [
                    {{
                        "claim": "Specific claim about a founder's background or achievements",
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
                {"claim": item["claim"], "source_document": item.get("source_document", "Founder_Profile.pdf"), "agent": "Founder Agent"}
                for item in analysis.get("evidence", [])
            ]
            
            return {
                "founder_analysis": analysis,
                "evidence": formatted_evidence,
                "agents_executed": ["founder_agent"]
            }
        except Exception as e:
            print(f"[Founder Agent] Gemini API error: {e}. Falling back to heuristics.")

    # 2. Fallback / Mock Logic
    if "aetherhealth" in startup_name.lower():
        analysis = {
            "score": 95,
            "summary": "Outstanding founding team with highly complementary biomedical AI, enterprise PM, and clinical operations backgrounds.",
            "strengths": [
                "CEO Aarav Mehta holds a PhD in Biomedical AI and was a lead AI Scientist at Philips.",
                "CPO Kavya Raman was a Senior Product Manager at Microsoft Healthcare.",
                "COO Nishant Rao holds significant clinical operations experience from Apollo Hospitals."
            ],
            "weaknesses": [
                "The team has no prior venture-backed co-founding history together."
            ],
            "evidence": [
                {"claim": "Dr. Aarav Mehta is ex-Philips AI scientist with PhD", "source_document": "Founder_Profile.pdf"},
                {"claim": "Kavya Raman is ex-Microsoft CPO", "source_document": "Founder_Profile.pdf"},
                {"claim": "Nishant Rao is ex-Apollo Operations Director", "source_document": "Founder_Profile.pdf"}
            ]
        }
    elif "logichain" in startup_name.lower():
        analysis = {
            "score": 70,
            "summary": "Strong product leadership under CEO Rohan Iyer, though co-founding skill sets are unbalanced.",
            "strengths": [
                "CEO Rohan Iyer has extensive supply chain logistics experience from Amazon.",
                "Rohan has solid engineering credentials."
            ],
            "weaknesses": [
                "Co-founder is a fresh university graduate with zero commercial or industry experience."
            ],
            "evidence": [
                {"claim": "Rohan Iyer spent 6 years at Amazon SCM", "source_document": "Founder_Profile.pdf"},
                {"claim": "Co-founder graduated in 2025 with CS degree", "source_document": "Founder_Profile.pdf"}
            ]
        }
    elif "cryptoquant" in startup_name.lower():
        analysis = {
            "score": 40,
            "summary": "Inexperienced founding team lacking both deep financial markets and software deployment expertise.",
            "strengths": [
                "CEO Aditya Kapoor has high energy and academic programming experience."
            ],
            "weaknesses": [
                "Aditya Kapoor is a recent graduate with no commercial history.",
                "Co-founder has a marketing-only background, lacking technical trading engine experience."
            ],
            "evidence": [
                {"claim": "Aditya Kapoor graduated in 2025", "source_document": "Founder_Profile.pdf"},
                {"claim": "Co-founder experience limited to social media management", "source_document": "Founder_Profile.pdf"}
            ]
        }
    else:
        # Dynamic Heuristic Parsing for custom uploaded documents!
        kw_matches = find_sentences_with_keywords(docs, ["founder", "phd", "ex-", "experience", "ceo", "resume", "background", "team"])
        
        strengths = []
        evidence = []
        for sentence, filename in kw_matches[:3]:
            # Add up to 3 strengths directly extracted from the PDF text!
            strengths.append(sentence)
            evidence.append({"claim": sentence, "source_document": filename})
            
        if not strengths:
            strengths = [f"The founding team of {startup_name} has baseline credentials and domain background."]
            evidence = [{"claim": "Founder details provided in profile document", "source_document": "Founder_Profile.pdf"}]
            
        analysis = {
            "score": 75 if len(kw_matches) > 0 else 65,
            "summary": f"Dynamic assessment of {startup_name} team from uploaded profile files.",
            "strengths": strengths,
            "weaknesses": ["Venture exit history and detailed cap alignment verification required."],
            "evidence": evidence
        }
        
    formatted_evidence = [
        {"claim": item["claim"], "source_document": item["source_document"], "agent": "Founder Agent"}
        for item in analysis["evidence"]
    ]
    
    return {
        "founder_analysis": analysis,
        "evidence": formatted_evidence,
        "agents_executed": ["founder_agent"]
    }