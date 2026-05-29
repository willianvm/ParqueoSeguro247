from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..database import get_db
import uuid
from ..database import get_db
from ..models.schemas import ReservaCreate, ReservaResponse, ResponseModel

router = APIRouter(prefix="/api/reservas", tags=["Reservas"])

@router.get("/", response_model=List[ReservaResponse])
def listar_reservas(db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM reserva")
    resultados = cursor.fetchall()
    cursor.close()
    return resultados

@router.post("/", response_model=ResponseModel)
def crear_reserva(reserva: ReservaCreate, db=Depends(get_db)):
    cursor = db.cursor()
    reserva_uuid = reserva.uuid if reserva.uuid else str(uuid.uuid4())
    try:
        cursor.execute("""
            INSERT INTO reserva (uuid, tipo_solicitud, descripcion, estado_reserva, fecha_, cliente_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (reserva_uuid, reserva.tipo_solicitud, reserva.descripcion,
              reserva.estado_reserva or 'PENDIENTE', reserva.fecha_, reserva.cliente_id))
        db.commit()
        return ResponseModel(success=True, message="Reserva creada",
                           data={"idreserva": cursor.lastrowid})
    except pymysql.Error as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
