from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import shutil
import os

# =========================
# FASTAPI
# =========================

app = FastAPI()

# =========================
# CORS FIX
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# LOAD YOLO MODEL
# =========================

model = YOLO("yolov8n.pt")

# =========================
# TEMP FOLDER
# =========================

TEMP_FOLDER = "temp"

os.makedirs(TEMP_FOLDER, exist_ok=True)

# =========================
# ROOT TEST
# =========================

@app.get("/")
def home():

    return {
        "message": "BananaSense Backend Running 🍌"
    }

# =========================
# DETECT API
# =========================

@app.post("/detect")
async def detect(file: UploadFile = File(...)):

    try:

        # Save uploaded image
        file_path = os.path.join(
            TEMP_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        # YOLO prediction
        results = model(file_path)

        detections = []

        # Read YOLO results
        for result in results:

            boxes = result.boxes

            for box in boxes:

                confidence = float(
                    box.conf[0] * 100
                )

                class_id = int(
                    box.cls[0]
                )

                class_name = model.names[
                    class_id
                ]

                # Only banana
                if class_name == "banana":

                    detections.append({

                        "class": class_name,

                        "confidence":
                            round(confidence, 2)

                    })

        return {

            "success": True,

            "detections": detections

        }

    except Exception as e:

        return {

            "success": False,

            "error": str(e)

        }