CREATE DATABASE IF NOT EXISTS sgal_lembo;
USE sgal_lembo;

CREATE TABLE `ciclo_cultivo` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_ciclo` varchar(10) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `estado` enum('Activo','Inactivo','Finalizado') NOT NULL,
  `fecha_inicial` date NOT NULL,
  `fecha_final` date NOT NULL,
  `fotografia` varchar(255) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cultivo` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tipo` enum('Maíz','Trigo','Cebada','Frutas','Verduras','Legumbres') NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `identificador` varchar(10) NOT NULL,
  `tamano` decimal(10,2) NOT NULL,
  `ubicacion` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `fotografia` varchar(255) DEFAULT NULL,
  `estado` enum('Activo') NOT NULL DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `identificador` (`identificador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `insumo` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(25) NOT NULL,
  `estado` enum('Habilitado','Deshabilitado') NOT NULL DEFAULT 'Habilitado',
  `tipo` enum('Fertilizante','Pesticida','Semilla','Herramienta') NOT NULL,
  `unidad_medida` enum('Kilogramos','Litros','Unidades','Metros') NOT NULL,
  `fotografia` varchar(255) DEFAULT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  `valor_total` decimal(10,2) GENERATED ALWAYS AS (`cantidad` * `valor_unitario`) STORED,
  `descripcion` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `sensor` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(25) NOT NULL,
  `estado` enum('Habilitado','Deshabilitado') NOT NULL DEFAULT 'Habilitado',
  `tipo` enum('Temperatura','Humedad','pH','Luminosidad') NOT NULL,
  `unidad_medida` enum('°C','%','pH','Lux') NOT NULL,
  `fotografia` varchar(255) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuario` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tipo_usuario` enum('Admin','Operador') NOT NULL,
  `tipo_documento` enum('CC','TI','NIT') NOT NULL,
  `num_documento` varchar(10) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `num_telefono` varchar(10) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `fotografia` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `num_documento` (`num_documento`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `usuario` 
ADD COLUMN `contrasena` VARCHAR(255) NOT NULL AFTER `correo`;

/* INTEGRACIÓN  */
CREATE TABLE integracion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  cultivo_id INT,
  estado ENUM('Activo', 'Inactivo') NOT NULL,
  fecha_inicial DATE NOT NULL,
  fecha_final DATE NOT NULL,
  fotografia VARCHAR(255),
  FOREIGN KEY (cultivo_id) REFERENCES cultivo(id)
);

-- Relación con sensores (ajustada a tu estructura)
CREATE TABLE IF NOT EXISTS integracion_sensor (
    integracion_id INT,
    sensor_id INT UNSIGNED,
    PRIMARY KEY (integracion_id, sensor_id),
    FOREIGN KEY (integracion_id) REFERENCES integracion(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_id) REFERENCES sensor(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Relación con insumos
CREATE TABLE IF NOT EXISTS integracion_insumo (
    integracion_id INT,
    insumo_id INT UNSIGNED,
    cantidad DECIMAL(10,2) NOT NULL DEFAULT 1,
    PRIMARY KEY (integracion_id, insumo_id),
    FOREIGN KEY (integracion_id) REFERENCES integracion(id) ON DELETE CASCADE,
    FOREIGN KEY (insumo_id) REFERENCES insumo(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Relación con ciclos de cultivo
CREATE TABLE IF NOT EXISTS integracion_ciclo_cultivo (
    integracion_id INT,
    ciclo_cultivo_id INT UNSIGNED,
    PRIMARY KEY (integracion_id, ciclo_cultivo_id),
    FOREIGN KEY (integracion_id) REFERENCES integracion(id) ON DELETE CASCADE,
    FOREIGN KEY (ciclo_cultivo_id) REFERENCES ciclo_cultivo(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Relación con operadores
CREATE TABLE IF NOT EXISTS integracion_operador (
    integracion_id INT,
    operador_id INT UNSIGNED,
    PRIMARY KEY (integracion_id, operador_id),
    FOREIGN KEY (integracion_id) REFERENCES integracion(id) ON DELETE CASCADE,
    FOREIGN KEY (operador_id) REFERENCES usuario(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;