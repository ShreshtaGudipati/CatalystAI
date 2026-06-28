import os
import uuid
from typing import List, Dict, Any
from fastapi import UploadFile
from backend.config import UPLOAD_DIR

class UploadService:
    @staticmethod
    async def save_uploaded_files(files: List[UploadFile]) -> Dict[str, Any]:
        case_id = str(uuid.uuid4())
        case_dir = os.path.join(UPLOAD_DIR, case_id)
        os.makedirs(case_dir, exist_ok=True)
        
        file_list = []
        for file in files:
            file_path = os.path.join(case_dir, file.filename)
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
            file_list.append(file.filename)
            
        return {
            "case_id": case_id,
            "uploaded_files": file_list,
            "message": f"Successfully uploaded {len(files)} files."
        }
