import React, { useState, useEffect } from 'react';
import { espaciosService, vehiculosService, reservasService } from '../services/api';

function Dashboard() {
  const [espacios, setEspacios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [espaciosRes, vehiculosRes, reservasRes] = await Promise.all([
          espaciosService.listar(),
          vehiculosService.listar(),
          reservasService.listar(),
        ]);
        setEspacios(espaciosRes.data);
        setVehiculos(vehiculosRes.data);
        setReservas(reservasRes.data);
        setError('');
      } catch (err) {
        setError('Error al cargar datos. ¿El backend está corriendo?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) return <div className="text-center mt-5">Cargando datos...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  const reservasActivas = reservas.filter(r => r.estado_reserva === 'ACTIVA').length;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Parqueo Seguro 24/7</h1>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Espacios Totales</h5>
              <p className="card-text display-4">{espacios.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Vehículos Registrados</h5>
              <p className="card-text display-4">{vehiculos.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Reservas Activas</h5>
              <p className="card-text display-4">{reservasActivas}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-header">
          <h5>Lista de Espacios de Parqueadero</h5>
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr><th>Número</th><th>Precio por hora</th><th>Descripción</th></tr>
            </thead>
            <tbody>
              {espacios.map(espacio => (
                <tr key={espacio.idespacio_parqueadero}>
                  <td>{espacio.numero_espacio}</td>
                  <td>${espacio.precio_hora?.toLocaleString()}</td>
                  <td>{espacio.descripcion || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
