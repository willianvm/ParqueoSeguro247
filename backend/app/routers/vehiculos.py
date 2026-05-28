from fastapi import APIRouter, HTTPException, Depends
from typing import List
import mysql.connector
import uuid
from ..database import get_db
from ..models.schemas import VehiculoCreate, VehiculoResponse, ResponseModel

router = APIRouter(prefix="/api/vehiculos", tags=["Vehículos"])

@router.get("/", response_model=List[VehiculoResponse])
def listar_vehiculos(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM vehiculo")
    resultados = cursor.fetchall()
    cursor.close()
    return resultados

@router.get("/{vehiculo_id}", response_model=VehiculoResponse)
def obtener_vehiculo(vehiculo_id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM vehiculo WHERE idvehiculo = %s", (vehiculo_id,))
    resultado = cursor.fetchone()
    cursor.close()
    if not resultado:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    return resultado

@router.post("/", response_model=ResponseModel)
def crear_vehiculo(vehiculo: VehiculoCreate, db=Depends(get_db)):
    cursor = db.cursor()
    vehiculo_uuid = vehiculo.uuid if vehiculo.uuid else str(uuid.uuid4())
    try:
        cursor.execute("""
            INSERT INTO vehiculo (uuid, placa, tipo_vehiculo, marca, color, cliente_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (vehiculo_uuid, vehiculo.placa, vehiculo.tipo_vehiculo,
              vehiculo.marca, vehiculo.color, vehiculo.cliente_id))
        db.commit()
        return ResponseModel(success=True, message="Vehículo registrado", 
                           data={"idvehiculo": cursor.lastrowid})
    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
