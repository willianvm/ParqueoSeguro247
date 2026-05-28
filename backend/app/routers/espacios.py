from fastapi import APIRouter, Depends
from typing import List
from ..database import get_db
from ..models.schemas import EspacioResponse

router = APIRouter(prefix="/api/espacios", tags=["Espacios"])

@router.get("/", response_model=List[EspacioResponse])
def listar_espacios(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM espacio_parqueadero")
    resultados = cursor.fetchall()
    cursor.close()
    return resultados

@router.get("/disponibles", response_model=List[EspacioResponse])
def espacios_disponibles(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT ep.* FROM espacio_parqueadero ep
        LEFT JOIN reserva r ON ep.idespacio_parqueadero = r.cliente_id
        WHERE r.estado_reserva != 'ACTIVA' OR r.estado_reserva IS NULL
    """)
    resultados = cursor.fetchall()
    cursor.close()
    return resultados
