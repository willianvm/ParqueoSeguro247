import React, { useState, useEffect } from 'react';
import { reservasService } from '../services/api';

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [formData, setFormData] = useState({
    uuid: crypto.randomUUID(),
    tipo_solicitud: '',
    descripcion: '',
    estado_reserva: 'PENDIENTE',
    fecha_: new Date().toISOString().split('T')[0],
    cliente_id: null,
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const res = await reservasService.listar();
        setReservas(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    cargarReservas();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const response = await reservasService.crear(formData);
      if (response.data.success) {
        setMensaje('✅ Reserva creada exitosamente');
        const res = await reservasService.listar();
        setReservas(res.data);
        setFormData({
          uuid: crypto.randomUUID(),
          tipo_solicitud: '',
          descripcion: '',
          estado_reserva: 'PENDIENTE',
          fecha_: new Date().toISOString().split('T')[0],
          cliente_id: null,
        });
      } else {
        setError('Error al crear reserva');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error de conexión');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header"><h4>Nueva Reserva</h4></div>
            <div className="card-body">
              {mensaje && <div className="alert alert-success">{mensaje}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Tipo de Solicitud</label>
                  <input type="text" className="form-control" name="tipo_solicitud" value={formData.tipo_solicitud} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="descripcion" rows="2" value={formData.descripcion} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha</label>
                  <input type="date" className="form-control" name="fecha_" value={formData.fecha_} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Crear Reserva</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card">
            <div className="card-header"><h4>Reservas Registradas</h4></div>
            <div className="card-body">
              <table className="table table-sm">
                <thead><tr><th>ID</th><th>Tipo</th><th>Fecha</th><th>Estado</th></tr></thead>
                <tbody>
                  {reservas.map(reserva => (
                    <tr key={reserva.idreserva}>
                      <td>{reserva.idreserva}</td>
                      <td>{reserva.tipo_solicitud || '-'}</td>
                      <td>{reserva.fecha_}</td>
                      <td><span className={`badge bg-${reserva.estado_reserva === 'ACTIVA' ? 'success' : 'secondary'}`}>{reserva.estado_reserva}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservas;
