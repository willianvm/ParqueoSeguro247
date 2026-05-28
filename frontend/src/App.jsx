import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import RegistroVehiculo from './components/RegistroVehiculo';
import Reservas from './components/Reservas';

function App() {
  const [vistaActual, setVistaActual] = useState('dashboard');

  const renderVista = () => {
    switch (vistaActual) {
      case 'dashboard':
        return <Dashboard />;
      case 'registro':
        return <RegistroVehiculo />;
      case 'reservas':
        return <Reservas />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#" onClick={() => setVistaActual('dashboard')}>
            🅿️ Parqueo Seguro 24/7
          </a>
          <div className="navbar-nav">
            <button
              className={`nav-link btn btn-link ${vistaActual === 'dashboard' ? 'active' : ''}`}
              onClick={() => setVistaActual('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`nav-link btn btn-link ${vistaActual === 'registro' ? 'active' : ''}`}
              onClick={() => setVistaActual('registro')}
            >
              Registrar Vehículo
            </button>
            <button
              className={`nav-link btn btn-link ${vistaActual === 'reservas' ? 'active' : ''}`}
              onClick={() => setVistaActual('reservas')}
            >
              Reservas
            </button>
          </div>
        </div>
      </nav>
      {renderVista()}
    </div>
  );
}

export default App;
