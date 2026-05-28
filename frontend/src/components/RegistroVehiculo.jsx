import React, { useState } from 'react';
import { vehiculosService } from '../services/api';

function RegistroVehiculo() {
  const [formData, setFormData] = useState({
    uuid: crypto.randomUUID(),
    placa: '',
    tipo_vehiculo: 'AUTOMOVIL',
    marca: '',
    color: '',
    cliente_id: null,
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const response = await vehiculosService.crear(formData);
      if (response.data.success) {
        setMensaje('✅ Vehículo registrado exitosamente');
        setFormData({
          uuid: crypto.randomUUID(),
          placa: '',
          tipo_vehiculo: 'AUTOMOVIL',
          marca: '',
          color: '',
          cliente_id: null,
        });
      } else {
        setError('Error al registrar vehículo');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error de conexión con el servidor');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header"><h3>Registro de Vehículo</h3></div>
        <div className="card-body">
          {mensaje && <div className="alert alert-success">{mensaje}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Placa *</label>
              <input type="text" className="form-control" name="placa" value={formData.placa} onChange={handleChange} required maxLength="10" placeholder="Ej: ABC123" />
            </div>
            <div className="mb-3">
              <label className="form-label">Tipo de Vehículo</label>
              <select className="form-select" name="tipo_vehiculo" value={formData.tipo_vehiculo} onChange={handleChange}>
                <option value="AUTOMOVIL">Automóvil</option>
                <option value="MOTOCICLETA">Motocicleta</option>
                <option value="CAMIONETA">Camioneta</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Marca</label>
              <input type="text" className="form-control" name="marca" value={formData.marca} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Color</label>
              <input type="text" className="form-control" name="color" value={formData.color} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary">Registrar Vehículo</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistroVehiculo;
