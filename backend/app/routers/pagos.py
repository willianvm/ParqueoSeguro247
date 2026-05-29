from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..database import get_db
import uuid
from ..database import get_db
from ..models.schemas import PagoBase, PagoResponse, ResponseModel

router = APIRouter(prefix="/api/pagos", tags=["Pagos"])

@router.get("/", response_model=List[PagoResponse])
def listar_pagos(db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM pago")
    resultados = cursor.fetchall()
    cursor.close()
    return resultados

@router.post("/", response_model=ResponseModel)
def procesar_pago(pago: PagoBase, db=Depends(get_db)):
    cursor = db.cursor()
    pago_uuid = pago.uuid if pago.uuid else str(uuid.uuid4())
    try:
        cursor.execute("""
            INSERT INTO pago (uuid, fecha_pago, valor_pagado, metodo_pago, estado_pago, numero_recibo)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (pago_uuid, pago.fecha_pago, pago.valor_pagado,
              pago.metodo_pago, pago.estado_pago or 'PENDIENTE', pago.numero_recibo))
        db.commit()
        return ResponseModel(success=True, message="Pago procesado",
                           data={"idpago": cursor.lastrowid})
    except pymysql.Error as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
