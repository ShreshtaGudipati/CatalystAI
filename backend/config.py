import os

# Base Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_DIR = os.path.dirname(BASE_DIR)

# Folders to initialize
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
LOGS_DIR = os.path.join(BASE_DIR, "logs")
DATABASE_DIR = os.path.join(BASE_DIR, "database")

# DB File Path
DB_PATH = os.path.join(DATABASE_DIR, "catalyst_ai.db")

# Initialize all required folders
for folder in [UPLOAD_DIR, REPORTS_DIR, LOGS_DIR, DATABASE_DIR]:
    os.makedirs(folder, exist_ok=True)
