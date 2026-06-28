from fastapi import APIRouter, HTTPException
from backend.database.schemas import ApprovalRequest
from backend.services.approval_service import ApprovalService

router = APIRouter(prefix="/approve", tags=["Approval"])

@router.post("")
async def approve_decision(request: ApprovalRequest):
    """
    Records human decision review comments and triggers memory learning post-approval.
    """
    updated_state = ApprovalService.submit_approval(
        decision_id=request.decision_id,
        status=request.status,
        comments=request.comments,
        reviewer=request.reviewer
    )
    if not updated_state:
        raise HTTPException(status_code=404, detail="Decision case not found")
    return updated_state
