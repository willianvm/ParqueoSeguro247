import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;

export const vehiculosService = {
  listar: () => api.get('/vehiculos/'),
  obtener: (id) => api.get(`/vehiculos/${id}/`),
  crear: (data) => api.post('/vehiculos/', data),
  actualizar: (id, data) => api.put(`/vehiculos/${id}/`, data),
  eliminar: (id) => api.delete(`/vehiculos/${id}/`),
};

export const espaciosService = {
  listar: () => api.get('/espacios/'),
  disponibles: () => api.get('/espacios/disponibles'),
};

export const reservasService = {
  listar: () => api.get('/reservas/'),
  crear: (data) => api.post('/reservas/', data),
};

export const pagosService = {
  listar: () => api.get('/pagos/'),
  procesar: (data) => api.post('/pagos/', data),
};
