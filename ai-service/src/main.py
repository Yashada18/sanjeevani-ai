from fastapi import FastAPI
import uvicorn

app = FastAPI(title="ERT AI Service")

@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-routing"}

@app.post("/route/optimize")
def optimize_route(data: dict):
    # Phase 3 will implement real AI routing
    return {
        "status": "placeholder",
        "message": "Route optimization coming in Phase 3"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)