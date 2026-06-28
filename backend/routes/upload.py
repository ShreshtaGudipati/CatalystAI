from typing import List
from fastapi import APIRouter, UploadFile, File
from backend.services.upload_service import UploadService

router = APIRouter(prefix="/upload", tags=["Upload"])

@app_router := router.post("")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Accepts files, validates, and stores in the session uploads folder.
    """
    return await UploadService.save_uploaded_files(files)
