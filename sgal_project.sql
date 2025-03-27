CREATE DATABASE IF NOT EXISTS sgal_project;
USE sgal_project;

CREATE TABLE `ciclo_cultivo` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_ciclo` varchar(10) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `estado` enum('Activo','Inactivo','Finalizado') NOT NULL,
  `fecha_inicial` date NOT NULL,
  `fecha_final` date NOT NULL,
  `fotografia` varchar(255) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cultivo` (
  `id` int(10) UNSIGNED NOT NULL,
  `tipo` enum('Maíz','Trigo','Cebada','Frutas','Verduras','Legumbres') NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `identificador` varchar(10) NOT NULL,
  `tamano` decimal(10,2) NOT NULL,
  `ubicacion` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `fotografia` varchar(255) DEFAULT NULL,
  `estado` enum('Activo') NOT NULL DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `insumo` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `estado` enum('Habilitado','Deshabilitado') NOT NULL DEFAULT 'Habilitado',
  `tipo` enum('Fertilizante','Pesticida','Semilla','Herramienta') NOT NULL,
  `unidad_medida` enum('Kilogramos','Litros','Unidades','Metros') NOT NULL,
  `fotografia` varchar(255) DEFAULT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  `valor_total` decimal(10,2) GENERATED ALWAYS AS (`cantidad` * `valor_unitario`) STORED,
  `descripcion` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `sensor` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `estado` enum('Habilitado','Deshabilitado') NOT NULL DEFAULT 'Habilitado',
  `tipo` enum('Temperatura','Humedad','pH','Luminosidad') NOT NULL,
  `unidad_medida` enum('°C','%','pH','Lux') NOT NULL,
  `fotografia` varchar(255) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuario` (
  `id` int(10) UNSIGNED NOT NULL,
  `tipo_usuario` enum('Admin','Operador') NOT NULL,
  `tipo_documento` enum('CC','TI','NIT') NOT NULL,
  `num_documento` varchar(10) NOT NULL,
  `nombre` varchar(25) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `num_telefono` varchar(10) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `fotografia` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `ciclo_cultivo`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `cultivo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identificador` (`identificador`);

ALTER TABLE `insumo`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `sensor`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `num_documento` (`num_documento`),
  ADD UNIQUE KEY `correo` (`correo`);

ALTER TABLE `ciclo_cultivo`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `cultivo`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `insumo`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `sensor`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `usuario`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;
