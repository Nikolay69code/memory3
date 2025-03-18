from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Монтируем статические файлы
app.mount("/images", StaticFiles(directory="images"), name="images")

@app.post("/api/upload")
async def upload_photo(file: UploadFile = File(...)):
    try:
        # Генерируем уникальное имя файла
        file_name = f"photo{len(os.listdir('images')) + 1}.jpg"
        file_path = f"images/{file_name}"
        
        # Сохраняем файл
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {"success": True, "filename": file_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/photos/{filename}")
async def delete_photo(filename: str):
    try:
        file_path = f"images/{filename}"
        if os.path.exists(file_path):
            os.remove(file_path)
            return {"success": True}
        raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/photos")
async def get_photos():
    try:
        photos = os.listdir("images")
        return {"photos": photos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 