from pydantic import BaseModel
from datetime import date
from typing import Optional

class VehiculoBase(BaseModel):
    uuid: str
    placa: str
    tipo_vehiculo: Optional[str] = None
    marca: Optional[str] = None
    color: Optional[str] = None
    cliente_id: Optional[int] = None

class VehiculoCreate(VehiculoBase):
    pass

class VehiculoResponse(VehiculoBase):
    idvehiculo: int

class EspacioBase(BaseModel):
    uuid: str
    numero_espacio: Optional[str] = None
    precio_hora: Optional[float] = None
    descripcion: Optional[str] = None
    parqueadero_id: Optional[int] = None

class EspacioResponse(EspacioBase):
    idespacio_parqueadero: int

class ReservaBase(BaseModel):
    uuid: str
    tipo_solicitud: Optional[str] = None
    descripcion: Optional[str] = None
    estado_reserva: Optional[str] = None
    fecha_: Optional[date] = None
    cliente_id: Optional[int] = None

class ReservaCreate(ReservaBase):
    pass

class ReservaResponse(ReservaBase):
    idreserva: int

class PagoBase(BaseModel):
    uuid: str
    fecha_pago: Optional[date] = None
    valor_pagado: Optional[float] = None
    metodo_pago: Optional[str] = None
    estado_pago: Optional[str] = None
    numero_recibo: Optional[int] = None

class PagoResponse(PagoBase):
    idpago: int

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
