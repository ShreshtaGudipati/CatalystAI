import os

def generate_cases():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sample_dir = os.path.join(base_dir, "sample_data")
    
    cases = {
        "Case_01_AetherHealth_AI": {
            "Pitch_Deck.pdf": "AetherHealth AI Pitch Deck. Predicting ICU patient deterioration using vitals. India + SEA. Asked: $2.5M Seed.",
            "Founder_Profile.pdf": "CEO Dr. Aarav Mehta (PhD Biomedical AI, ex-Philips scientist). Kavya Raman (ex-Microsoft CPO). Nishant Rao (ex-Apollo clinical ops).",
            "Financial_Projections.pdf": "ARR: $720,000. Growth: 148% YoY. Burn rate: $52,000/month. Runway: 19 months.",
            "Market_Research_Report.pdf": "TAM: $18B. CAGR: 29%. Competitors: Qure.ai, Niramai, Aidoc. Real-time ICU prediction.",
            "Customer_Meeting_Notes.pdf": "Hospital CEO expressed strong interest. Need pricing validation. Security compliance doc requested.",
            "CRM_History.pdf": "18 June - Founder demonstrated live product. Hospital pilot conversions pending.",
            "Investment_Playbook.pdf": "XL Ventures Guidelines: 12 months runway required. Experienced founders and TAM > $1B preferred.",
            "Due_Diligence_Checklist.pdf": "IP verification complete. Clinical trial validation underway. FDA medical certification is pending."
        },
        "Case_02_LogiChain_Solutions": {
            "Pitch_Deck.pdf": "LogiChain Solutions Pitch Deck. Demand forecasting for manufacturers. AI supply chain algorithms.",
            "Founder_Profile.pdf": "CEO Rohan Iyer (Ex-Amazon Supply Chain). Co-founder: CS Fresh Graduate.",
            "Financial_Projections.pdf": "ARR: $180,000. Burn: $95,000/month. Runway: 7 months.",
            "Market_Research_Report.pdf": "SCM forecasting market growing rapidly. Competitors: Project44, FourKites, Oracle SCM.",
            "Customer_Meeting_Notes.pdf": "Pilots progressing. Need to audit contracts and check retention reports.",
            "CRM_History.pdf": "12 June - Pilot setup initiated. Complete statements requested.",
            "Investment_Playbook.pdf": "XL Ventures Guidelines: Supply chain targets must display solid runway margin.",
            "Due_Diligence_Checklist.pdf": "Customer contracts and audited financials are currently unavailable."
        },
        "Case_03_CryptoQuant_Labs": {
            "Pitch_Deck.pdf": "CryptoQuant Labs Pitch Deck. Automated crypto trading bots. Target: 'We will dominate crypto trading'.",
            "Founder_Profile.pdf": "CEO Aditya Kapoor (Recent CS Graduate). Co-founder: Marketing background only.",
            "Financial_Projections.pdf": "ARR: $18,000. Burn: $140,000/month. Runway: 2 months.",
            "Market_Research_Report.pdf": "Overcrowded bot market. Hundreds of competitors. No patent moats.",
            "Customer_Meeting_Notes.pdf": "Feedback suggests high retail interest but zero enterprise product validation.",
            "CRM_History.pdf": "10 June - Initial review complete. Severe risks identified.",
            "Investment_Playbook.pdf": "XL Ventures Guidelines: Crypto applications require strict compliance.",
            "Due_Diligence_Checklist.pdf": "Active regulatory uncertainty. Patent filings absent. No functional MVP."
        }
    }
    
    for case_name, files in cases.items():
        case_path = os.path.join(sample_dir, case_name)
        os.makedirs(case_path, exist_ok=True)
        print(f"Creating folder: {case_path}")
        
        for filename, content in files.items():
            file_path = os.path.join(case_path, filename)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"  - Wrote: {filename}")
            
    print("\n[OK] Sample datasets created successfully.")

if __name__ == "__main__":
    generate_cases()
