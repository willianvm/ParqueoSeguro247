from fastapi import APIRouter, Depends, HTTPException
from ..database import get_db

router = APIRouter(prefix="/api/espacios", tags=["Espacios"])

@router.get("/")
def listar_espacios(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)  # ← IMPORTANTE: dictionary=True
    try:
        cursor.execute("SELECT * FROM espacio_parqueadero")
        resultados = cursor.fetchall()  # Esto devuelve lista de diccionarios
        return resultados
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()