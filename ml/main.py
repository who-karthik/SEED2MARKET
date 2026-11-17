"""
Seed2Market - FastAPI ML Inference Microservice
Serves plant disease detection, model evaluation metrics, and class definitions.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path
from inference import analyze_plant_image

app = FastAPI(
    title="Seed2Market AI Crop Health Service",
    version="1.0.0",
    description="Agricultural Computer Vision and Decision Intelligence Engine"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent

@app.get("/")
def read_root():
    return {
        "service": "Seed2Market Crop Health ML Engine",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "seed2market-ml"}

@app.get("/api/v1/classes")
def get_supported_classes():
    classes_file = BASE_DIR / "classes.json"
    if not classes_file.exists():
        raise HTTPException(status_code=404, detail="Classes metadata not found")
    with open(classes_file, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/api/v1/model-metrics")
def get_model_evaluation_metrics():
    metrics_file = BASE_DIR / "metadata" / "evaluation_metrics.json"
    cm_file = BASE_DIR / "metadata" / "confusion_matrix.json"

    if not metrics_file.exists():
        # If train_and_eval hasn't generated yet, return standard benchmark report
        return {
            "status": "metrics_pending",
            "message": "Evaluation pipeline is generating."
        }

    with open(metrics_file, "r", encoding="utf-8") as f:
        metrics = json.load(f)
    
    cm_data = None
    if cm_file.exists():
        with open(cm_file, "r", encoding="utf-8") as f:
            cm_data = json.load(f)

    return {
        "metrics": metrics,
        "confusion_matrix": cm_data
    }

@app.post("/api/v1/predict")
async def predict_disease(image: UploadFile = File(...)):
    # Validate content type
    if image.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image type. Please upload a JPG or PNG.")

    image_bytes = await image.read()
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image size exceeds 10MB limit.")

    result = analyze_plant_image(image_bytes)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
