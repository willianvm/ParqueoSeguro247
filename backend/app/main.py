from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import vehiculos, espacios, reservas, auth

app = FastAPI(title="API Parqueo Seguro")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(vehiculos.router)
app.include_router(espacios.router)
app.include_router(reservas.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "API Parqueo Seguro funcionando"}