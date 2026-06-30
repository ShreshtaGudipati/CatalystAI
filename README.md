# CatalystAI
## Enterprise Agentic Decision Intelligence Platform

CatalystAI is a reusable Enterprise Agentic Decision Intelligence Platform that transforms fragmented enterprise information into trusted, explainable, and evidence-backed business decisions.

Unlike traditional AI assistants that rely on a single Large Language Model, CatalystAI uses a Planner Agent to dynamically orchestrate multiple specialized AI agents. Each agent contributes domain-specific intelligence while Enterprise Knowledge, Human-in-the-Loop governance, and Enterprise Memory ensure every recommendation is transparent, auditable, and continuously improving.

For this hackathon, CatalystAI is demonstrated using the **Startup Investment Intelligence** capability pack, enabling venture capital firms to perform AI-powered startup due diligence. The same platform architecture can be extended to Banking, Healthcare, Insurance, Procurement, Cybersecurity, Legal, HR, Government, and other enterprise domains.

---

# Why CatalystAI?

Enterprise organizations make thousands of high-value decisions every day using information scattered across documents, emails, CRM systems, meeting notes, financial reports, and organizational knowledge.

Traditional AI assistants answer questions.

CatalystAI helps organizations **make decisions.**

Instead of simply generating responses, CatalystAI:

- Dynamically orchestrates specialized AI agents
- Retrieves enterprise knowledge using RAG
- Generates explainable recommendations
- Supports Human-in-the-Loop approval
- Learns continuously through Enterprise Memory
- Provides a reusable platform architecture across multiple industries

---

# Key Platform Capabilities

- Dynamic Planner-Based Agent Orchestration
- Multi-Agent Decision Intelligence
- Retrieval-Augmented Generation (RAG)
- Enterprise Knowledge Retrieval
- Explainable AI Recommendations
- Confidence Scoring
- Evidence-Based Decision Making
- Human-in-the-Loop Governance
- Enterprise Memory & Continuous Learning
- Modular Capability Packs

---

# Enterprise Architecture

<img width="858" height="636" alt="image" src="https://github.com/user-attachments/assets/895a8d8c-7edb-4376-8bb1-05d724e86bec" />


CatalystAI is designed as a reusable Enterprise Decision Intelligence Platform consisting of:

- User Experience Layer
- Enterprise Knowledge Layer
- AI Orchestration Layer
- Decision Intelligence Layer
- Human Governance Layer
- Enterprise Memory Layer
- Capability Packs

---

# AI Core Architecture
<img width="814" height="678" alt="image" src="https://github.com/user-attachments/assets/4d7b1d76-b2d6-4148-a46e-fe0ed2e1a13e" />


At the heart of CatalystAI is the **Planner Agent**, responsible for dynamically orchestrating specialized AI agents.

The Planner coordinates:

- Founder Agent
- Financial Agent
- Market Agent
- Risk Agent
- Recommendation Agent

Every agent retrieves enterprise knowledge from a shared context before generating independent insights.

The Decision Intelligence layer consolidates all findings into a single explainable recommendation.

---

# Enterprise Decision Lifecycle

<img width="1023" height="604" alt="image" src="https://github.com/user-attachments/assets/a13527af-81b1-46bd-9150-2de7ae0e52e1" />

CatalystAI follows an end-to-end enterprise decision workflow:

1. Create Decision Case
2. Upload Business Documents
3. Planner Agent selects Specialized Agents
4. AI Agents perform parallel analysis
5. Decision Intelligence generates recommendation
6. Human Review & Approval
7. Enterprise Memory stores outcomes
8. Future decisions improve through continuous learning

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js + Vite |
| Backend | FastAPI |
| AI Orchestration | LangGraph |
| Agent Framework | LangChain |
| Large Language Model | Google Gemini |
| Knowledge Retrieval | Retrieval-Augmented Generation (RAG) |
| Vector Database | ChromaDB |
| Database | SQLite |
| Document Processing | PyMuPDF |
| Version Control | Git & GitHub |

---
For detailed documentation: https://docs.google.com/document/d/1O6ABBCV75ecZHhpNmfKc7glwhO6DewdWO2vvZa9aJG4/edit?usp=sharing

# Project Structure

```
CatalystAI/

├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── assets/
│   └── package.json
│
├── backend/
│   ├── agents/
│   ├── planner/
│   ├── memory/
│   ├── rag/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── app.py
│   └── requirements.txt
│
├── uploads/
├── docs/
├── README.md
└── catalyst_ai.db
```

---

# Prerequisites

- Python 3.10+
- Node.js 18+
- Google Gemini API Key

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/CatalystAI.git

cd CatalystAI
```

---

## Backend Setup

Create Virtual Environment

```bash
python -m venv .venv
```

Activate

Windows

```bash
.venv\Scripts\activate
```

Linux / macOS

```bash
source .venv/bin/activate
```

Install Dependencies

```bash
pip install -r backend/requirements.txt
```

Create

```
backend/.env
```

```env
GEMINI_API_KEY=YOUR_API_KEY
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

---

# Running CatalystAI

## Backend

```bash
uvicorn backend.app:app --reload
```

Backend

```
http://127.0.0.1:8000
```

Swagger

```
http://127.0.0.1:8000/docs
```

---

## Frontend

```bash
cd frontend

npm run dev
```

Frontend

```
http://localhost:5173
```

---

# Sample Documents

CatalystAI includes a complete startup investment case study based on Airbnb's early-stage investment scenario.

Upload the following documents into the platform:

- Pitch Deck
- Founder Profiles
- Financial Projections
- Market Research Report

These documents demonstrate the complete multi-agent due diligence workflow.

---
# Future Expansion

CatalystAI is built as a reusable platform.

New Capability Packs can be introduced without changing the underlying architecture.

Current roadmap includes:

- Healthcare Decision Intelligence
- Banking & Credit Risk
- Insurance Claim Assessment
- Procurement Intelligence
- Cybersecurity Incident Response
- Human Resources
- Legal & Compliance
- Government Decision Support
- Manufacturing Intelligence

---

# Team

Developed as part of the **XL Ventures AI Hackathon 2026**




