-- Crear tablas
CREATE TABLE IF NOT EXISTS usuario (
    idusuario INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehiculo (
    idvehiculo INT PRIMARY KEY AUTO_INCREMENT,
    placa VARCHAR(10) UNIQUE NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    propietario_id INT,
    FOREIGN KEY (propietario_id) REFERENCES usuario(idusuario)
);

CREATE TABLE IF NOT EXISTS espacio_parqueadero (
    idespacio INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(10) UNIQUE NOT NULL,
    estado ENUM('disponible', 'ocupado', 'mantenimiento') DEFAULT 'disponible'
);

CREATE TABLE IF NOT EXISTS reserva (
    idreserva INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    espacio_id INT,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    estado ENUM('activa', 'completada', 'cancelada') DEFAULT 'activa',
    FOREIGN KEY (usuario_id) REFERENCES usuario(idusuario),
    FOREIGN KEY (espacio_id) REFERENCES espacio_parqueadero(idespacio)
);

-- Insertar datos de prueba
INSERT INTO espacio_parqueadero (numero, estado) VALUES
('A1', 'disponible'),
('A2', 'disponible'),
('B1', 'disponible'),
('B2', 'disponible');
