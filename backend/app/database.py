"""
Conexión a la base de datos MySQL usando PyMySQL (puro Python)
@author William Andres Villa
"""
import mysql.connector
from mysql.connector import Error

def get_db():
    """Dependencia de FastAPI para obtener conexión de BD"""
    connection = None
    try:
        connection = mysql.connector.connect(
            host="localhost",
            port=3306,
            database="parqueo_seguro",
            user="root",
            password="root123",
            use_pure=True
        )
        yield connection
    except Error as e:
        print(f"Error conectando a MySQL: {e}")
        raise
    finally:
        if connection and connection.is_connected():
            connection.close()