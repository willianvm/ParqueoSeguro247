import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance._initialize_connection()
        return cls._instance
    
    def _initialize_connection(self):
        try:
            self.connection = mysql.connector.connect(
                host=os.getenv('DB_HOST', 'localhost'),
                port=int(os.getenv('DB_PORT', 3307)),
                user=os.getenv('DB_USER', 'root'),
                password=os.getenv('DB_PASSWORD', 'admin123'),
                database=os.getenv('DB_NAME', 'parqueo_24_7_evidencia')
            )
            print("✅ Conectado a MySQL")
        except Error as e:
            print(f"❌ Error de conexión: {e}")
            self.connection = None
    
    def get_connection(self):
        if self.connection is None or not self.connection.is_connected():
            self._initialize_connection()
        return self.connection

db = Database()

def get_db():
    return db.get_connection()
