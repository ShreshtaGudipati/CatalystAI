from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import upload, analyze, approve, history, analytics, knowledge, memory

app = FastAPI(title="CatalystAI - Multi-Agent Decision Intelligence API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(approve.router)
app.include_router(history.router)
app.include_router(analytics.router)
app.include_router(knowledge.router)
app.include_router(memory.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to CatalystAI Decision Intelligence API (Modular Restructured Layer)",
        "docs_url": "/docs",
        "endpoints": {
            "upload": "/upload (POST)",
            "analyze": "/analyze (POST)",
            "decision_by_id": "/decision/{id} (GET)",
            "approve": "/approve (POST)",
            "history": "/history (GET)",
            "analytics": "/analytics (GET)",
            "knowledge": "/knowledge (GET)",
            "memory": "/memory (GET)"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
