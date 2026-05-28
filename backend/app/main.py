from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import vehiculos, espacios, reservas, pagos

app = FastAPI(
    title="Parqueo Seguro 24/7 API",
    description="API REST para gestión de parqueadero",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vehiculos.router)
app.include_router(espacios.router)
app.include_router(reservas.router)
app.include_router(pagos.router)

@app.get("/")
def root():
    return {"message": "Parqueo Seguro 24/7 API", "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
