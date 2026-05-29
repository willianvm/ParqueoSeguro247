from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
import uuid
from passlib.hash import sha256_crypt
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
    cursor = db.cursor(dictionary=True)
    
    try:
        # Verificar si el usuario existe
        cursor.execute("SELECT idusuario FROM usuario WHERE nombre_usuario = %s", (user.username,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="El usuario ya existe")

        # Crear nuevo usuario
        hashed = sha256_crypt.hash(user.password)
        user_uuid = str(uuid.uuid4())

        cursor.execute(
            "INSERT INTO usuario (uuid, nombre_usuario, contrasena) VALUES (%s, %s, %s)",
            (user_uuid, user.username, hashed)
        )
        db.commit()
        
        return {"success": True, "message": "Usuario registrado exitosamente"}
        
    except Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")
    finally:
        cursor.close()


@router.post("/login")
def login(user: LoginRequest, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT idusuario, nombre_usuario, contrasena FROM usuario WHERE nombre_usuario = %s", (user.username,))
        db_user = cursor.fetchone()

        if not db_user:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

        if not sha256_crypt.verify(user.password, db_user["contrasena"]):
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

        # Devolver información completa del usuario
        return {
            "success": True, 
            "message": "Autenticación satisfactoria",
            "user": {
                "id": db_user["idusuario"],
                "username": db_user["nombre_usuario"]
            }
        }
        
    finally:
        cursor.close()