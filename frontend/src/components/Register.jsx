import React, { useState } from 'react';
import { authService } from '../services/api';

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({ username, password });
      if (response.data.success) {
        setSuccess('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        setTimeout(() => {
          onRegisterSuccess(); // cambia a login después de 2 segundos
        }, 2000);
      } else {
        setError(response.data.message || 'Error en el registro');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Registro de Usuario</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmar contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </form>
            </div>
            <div className="card-footer text-center">
              <small>
                ¿Ya tienes cuenta?{' '}
                <button
                  className="btn btn-link p-0"
                  onClick={onSwitchToLogin}
                  style={{ textDecoration: 'underline' }}
                >
                  Inicia sesión aquí
                </button>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
