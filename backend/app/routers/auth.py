"""
Módulo de autenticación - Registro e inicio de sesión
Usa bcrypt directamente para hashear contraseñas
@author William Andres Villa
@version 1.1
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import mysql.connector
import uuid
import bcrypt
from ..database import get_db

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/register")
def register(user: RegisterRequest, db=Depends(get_db)):
    """
    Registra un nuevo usuario. La contraseña se hashea con bcrypt.
    """
    cursor = db.cursor(dictionary=True)

    # Verificar si el usuario ya existe
    cursor.execute("SELECT idusuario FROM usuario WHERE nombre_usuario = %s", (user.username,))
    if cursor.fetchone():
        cursor.close()
        raise HTTPException(status_code=400, detail="El usuario ya existe")

    # Hashear la contraseña (bcrypt maneja el salt automáticamente)
    # Limitar a 72 bytes (bcrypt) - pero normalmente las contraseñas cortas no hay problema
    hashed = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    hashed_str = hashed.decode('utf-8')

    user_uuid = str(uuid.uuid4())

    try:
        cursor.execute(
            "INSERT INTO usuario (uuid, nombre_usuario, contrasena) VALUES (%s, %s, %s)",
            (user_uuid, user.username, hashed_str)
        )
        db.commit()
        return {"success": True, "message": "Usuario registrado exitosamente"}
    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {str(e)}")
    finally:
        cursor.close()


@router.post("/login")
def login(user: LoginRequest, db=Depends(get_db)):
    """
    Inicia sesión verificando la contraseña hasheada.
    """
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT idusuario, contrasena FROM usuario WHERE nombre_usuario = %s", (user.username,))
    db_user = cursor.fetchone()
    cursor.close()

    if not db_user:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    # Verificar la contraseña (convertir a bytes)
    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user["contrasena"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    return {"success": True, "message": "Autenticación satisfactoria"}
