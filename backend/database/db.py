import sqlite3
import json
import os
from typing import Dict, Any, List
from backend.config import DB_PATH

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Decisions table to hold execution states
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS decisions (
        id TEXT PRIMARY KEY,
        startup_name TEXT,
        industry TEXT,
        status TEXT,
        recommendation TEXT,
        confidence_score INTEGER,
        state_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Memories table for lessons learned from human feedback
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        industry TEXT,
        startup_stage TEXT,
        pattern TEXT,
        ai_recommendation TEXT,
        human_decision TEXT,
        outcome TEXT,
        learning TEXT,
        timestamp TEXT
    )
    """)
    
    # Knowledge documents table for playbooks and guides
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT UNIQUE,
        category TEXT,
        content TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Pre-populate sample knowledge documents if empty
    cursor.execute("SELECT COUNT(*) FROM knowledge")
    if cursor.fetchone()[0] == 0:
        sample_knowledge = [
            ("XL Ventures General Investment Policy 2026", "Policy", 
             "General guidelines for seed and early-stage investments. Minimum requirement: 12 months runway, experienced founders, and TAM > $1B. Soft preference for AI integration."),
            ("Enterprise SaaS Due Diligence Playbook", "Playbook", 
             "Criterias to evaluate SaaS startups. Target: Gross Margins > 80%, LTV/CAC ratio > 3x, Monthly churn < 2%, and quarter-on-quarter expansion."),
            ("Venture Capital Risk Checklist", "Policy", 
             "Checks for regulatory exposures, patent coverage, founder dependencies, customer concentration risks, and capital burn efficiency.")
        ]
        cursor.executemany("""
        INSERT INTO knowledge (title, category, content) VALUES (?, ?, ?)
        """, sample_knowledge)
        
    # Pre-populate sample memories if empty
    cursor.execute("SELECT COUNT(*) FROM memories")
    if cursor.fetchone()[0] == 0:
        sample_memories = [
            ("Healthcare", "Seed", "Healthcare founders with clinical expertise", "INVEST", "APPROVED", "Positive", "Healthcare founders with medical domain expertise showed higher success.", "2026-06-25"),
            ("Supply Chain AI", "Seed", "Startups with runway < 6 months", "HOLD", "Needs More Information", "High Risk", "Supply Chain startups with runway under 9 months require additional financial validation.", "2026-06-26"),
            ("Healthcare", "Seed", "ARR growth >120% YoY", "INVEST", "APPROVED", "Positive Signal", "Strong YoY growth in ARR is a strong positive signal for product market fit.", "2026-06-25"),
            ("Crypto", "Seed", "No paying customers", "PASS", "APPROVED", "Negative Signal", "Crypto startups without product-market fit have historically underperformed.", "2026-06-27"),
            ("Software", "Seed", "Repeat founders", "INVEST", "APPROVED", "Positive Signal", "Founders with prior exits show high execution velocity.", "2026-06-25"),
            ("Fintech", "Seed", "Pending litigation", "PASS", "APPROVED", "High Risk", "Active court litigation drags founder focus and is an automatic fail risk.", "2026-06-25")
        ]
        cursor.executemany("""
        INSERT INTO memories (industry, startup_stage, pattern, ai_recommendation, human_decision, outcome, learning, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_memories)
        
    conn.commit()
    conn.close()

def save_decision(decision_id: str, state: Dict[str, Any]):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    startup_name = state.get("startup_name", "Unknown")
    industry = state.get("industry", "Unknown")
    status = state.get("human_review", {}).get("status", "PENDING_REVIEW")
    recommendation = state.get("recommendation", "PENDING")
    confidence_score = state.get("confidence_score", 0)
    state_json = json.dumps(state)
    
    cursor.execute("""
    INSERT OR REPLACE INTO decisions (id, startup_name, industry, status, recommendation, confidence_score, state_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (decision_id, startup_name, industry, status, recommendation, confidence_score, state_json))
    
    conn.commit()
    conn.close()

def get_decision(decision_id: str) -> Dict[str, Any]:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT state_json FROM decisions WHERE id = ?", (decision_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return json.loads(row[0])
    return None

def get_all_decisions() -> List[Dict[str, Any]]:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, startup_name, industry, status, recommendation, confidence_score, created_at FROM decisions ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    
    decisions = []
    for r in rows:
        decisions.append({
            "id": r[0],
            "startup_name": r[1],
            "industry": r[2],
            "status": r[3],
            "recommendation": r[4],
            "confidence_score": r[5],
            "created_at": r[6]
        })
    return decisions

def save_memory(memory_entry: Dict[str, Any]):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
    INSERT INTO memories (industry, startup_stage, pattern, ai_recommendation, human_decision, outcome, learning, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        memory_entry.get("industry"),
        memory_entry.get("startup_stage"),
        memory_entry.get("pattern"),
        memory_entry.get("ai_recommendation"),
        memory_entry.get("human_decision"),
        memory_entry.get("outcome"),
        memory_entry.get("learning"),
        memory_entry.get("timestamp")
    ))
    
    conn.commit()
    conn.close()

def search_memories(industry: str) -> List[Dict[str, Any]]:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT industry, startup_stage, pattern, ai_recommendation, human_decision, outcome, learning, timestamp FROM memories WHERE LOWER(industry) = LOWER(?)", (industry,))
    rows = cursor.fetchall()
    conn.close()
    
    memories = []
    for r in rows:
        memories.append({
            "industry": r[0],
            "startup_stage": r[1],
            "pattern": r[2],
            "ai_recommendation": r[3],
            "human_decision": r[4],
            "outcome": r[5],
            "learning": r[6],
            "timestamp": r[7]
        })
    return memories

def get_all_memories() -> List[Dict[str, Any]]:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT industry, startup_stage, pattern, ai_recommendation, human_decision, outcome, learning, timestamp FROM memories ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    
    memories = []
    for r in rows:
        memories.append({
            "industry": r[0],
            "startup_stage": r[1],
            "pattern": r[2],
            "ai_recommendation": r[3],
            "human_decision": r[4],
            "outcome": r[5],
            "learning": r[6],
            "timestamp": r[7]
        })
    return memories

def get_knowledge_documents() -> List[Dict[str, Any]]:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, title, category, content, updated_at FROM knowledge ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    
    docs = []
    for r in rows:
        docs.append({
            "id": r[0],
            "title": r[1],
            "category": r[2],
            "content": r[3],
            "updated_at": r[4]
        })
    return docs

# Run initial setup on import
init_db()
