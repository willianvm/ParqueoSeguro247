import React, { useState } from 'react';
import { authService } from '../services/api';

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.login({ username, password });
      if (response.data.success) {
        localStorage.setItem('user', username);
        onLoginSuccess();
      } else {
        setError('Credenciales incorrectas');
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
              <h3>Iniciar Sesión</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
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
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Validando...' : 'Ingresar'}
                </button>
              </form>
            </div>
            <div className="card-footer text-center">
              <small>
                ¿No tienes cuenta?{' '}
                <button
                  className="btn btn-link p-0"
                  onClick={onSwitchToRegister}
                  style={{ textDecoration: 'underline' }}
                >
                  Regístrate aquí
                </button>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
