from typing import Dict, Any
from backend.database import db

class AnalyticsService:
    @staticmethod
    def get_analytics_dashboard() -> Dict[str, Any]:
        decisions = db.get_all_decisions()
        total = len(decisions)
        
        approved = sum(1 for d in decisions if d["status"] == "APPROVED")
        rejected = sum(1 for d in decisions if d["status"] == "REJECTED")
        pending = sum(1 for d in decisions if d["status"] in ["PENDING_REVIEW", "PENDING"])
        
        avg_confidence = 0
        if total > 0:
            avg_confidence = sum(d["confidence_score"] for d in decisions) // total
            
        industries = {}
        for d in decisions:
            ind = d["industry"]
            industries[ind] = industries.get(ind, 0) + 1
            
        # Compile mock / aggregate metrics for display
        return {
            "total_decisions": total,
            "approved_count": approved,
            "rejected_count": rejected,
            "pending_reviews": pending,
            "average_confidence": avg_confidence,
            "industry_distribution": industries,
            "risk_distribution": {
                "high": sum(1 for d in decisions if d["confidence_score"] < 50),
                "medium": sum(1 for d in decisions if 50 <= d["confidence_score"] < 80),
                "low": sum(1 for d in decisions if d["confidence_score"] >= 80)
            },
            "agent_usage": {
                "planner_agent": total,
                "founder_agent": total,
                "financial_agent": sum(1 for d in decisions if d["confidence_score"] > 60), # mock active executions
                "market_agent": total,
                "risk_agent": total,
                "recommendation_agent": total
            }
        }
