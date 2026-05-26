from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import shutil
import os

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO Model
model = YOLO("yolov8n.pt")

@app.get("/")
def home():
    return {
        "message": "BananaSense AI Running 🍌"
    }

@app.post("/detect")
async def detect(file: UploadFile = File(...)):

    # Save uploaded image
    os.makedirs("temp", exist_ok=True)

    file_path = f"temp/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run detection
    results = model(file_path)

    detected = []

    for r in results:
        for box in r.boxes:

            class_id = int(box.cls[0])

            confidence = float(box.conf[0])

            label = model.names[class_id]

            detected.append({
                "label": label,
                "confidence": round(confidence * 100, 2)
            })

    return {
        "detections": detected
    }