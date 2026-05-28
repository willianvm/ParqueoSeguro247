import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    if (showRegister) {
      return <Register onRegisterSuccess={() => setShowRegister(false)} onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} onSwitchToRegister={() => setShowRegister(true)} />;
  }

  // Si está autenticado, muestra el dashboard
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">Parqueo Seguro 24/7</span>
          <button
            className="btn btn-outline-light"
            onClick={() => {
              localStorage.removeItem('user');
              setIsAuthenticated(false);
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
      <Dashboard />
    </div>
  );
}

export default App;
