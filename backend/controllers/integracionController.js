const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configura Multer para mantener extensiones
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

const crearIntegracion = async (req, res) => {
  let {
    nombre,
    cultivo_id,
    estado,
    fecha_inicial,
    fecha_final,
    sensores,
    insumos,
    ciclos,
    operadores
  } = req.body;
  
  // Parsear arrays si vienen como strings
  try {
    sensores = typeof sensores === 'string' ? JSON.parse(sensores) : (sensores || []);
    insumos = typeof insumos === 'string' ? JSON.parse(insumos) : (insumos || []);
    ciclos = typeof ciclos === 'string' ? JSON.parse(ciclos) : (ciclos || []);
    operadores = typeof operadores === 'string' ? JSON.parse(operadores) : (operadores || []);
  } catch (err) {
    return res.status(400).json({ error: 'Error al parsear arrays del cuerpo', detalles: err.message });
  }
  
  const fotografia = req.file ? req.file.filename : null;

  // Validación
  if (!nombre || !estado || !fecha_inicial || !fecha_final) {
    return res.status(400).json({
      error: 'Faltan datos requeridos',
      detalles: {
        nombre: !nombre ? 'Requerido' : undefined,
        estado: !estado ? 'Requerido' : undefined,
        fecha_inicial: !fecha_inicial ? 'Requerido' : undefined,
        fecha_final: !fecha_final ? 'Requerido' : undefined
      }
    });
  }

  try {
    await db.promise().beginTransaction();

    const [result] = await db.promise().query(
      `INSERT INTO integracion 
       (nombre, cultivo_id, estado, fecha_inicial, fecha_final, fotografia)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, cultivo_id || null, estado, fecha_inicial, fecha_final, fotografia]
    );

    const integracionId = result.insertId;

    if (sensores.length > 0) {
      await insertarRelaciones('integracion_sensor', integracionId, sensores);
    }

    if (insumos.length > 0) {
      for (const insumo of insumos) {
        await db.promise().query(
          `INSERT INTO integracion_insumo 
           (integracion_id, insumo_id, cantidad)
           VALUES (?, ?, ?)`,
          [integracionId, insumo.id, insumo.cantidad || 1]
        );
      }
    }

    if (ciclos.length > 0) {
      await insertarRelaciones('integracion_ciclo_cultivo', integracionId, ciclos);
    }

    if (operadores.length > 0) {
      await insertarRelaciones('integracion_operador', integracionId, operadores);
    }

    await db.promise().commit();

    res.status(201).json({
      id: integracionId,
      message: 'Integración creada exitosamente',
      integracion: {
        id: integracionId,
        nombre,
        cultivo_id,
        estado,
        fecha_inicial,
        fecha_final,
        fotografia
      }
    });

  } catch (error) {
    await db.promise().rollback();
    console.error('Error al crear integración:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalles: error.message
    });
  }
};

async function insertarRelaciones(tabla, integracionId, items) {
  if (!items || !Array.isArray(items) || items.length === 0) return;
  
  const values = items.flatMap(item => {
    const id = item.id || item; 
    return [integracionId, id];
  });
  
  const placeholders = items.map(() => '(?, ?)').join(',');
  
  await db.promise().query(
    `INSERT INTO ${tabla} VALUES ${placeholders}`,
    values
  );
}

const obtenerIntegraciones = async (req, res) => {
  try {
    // Obtener integraciones principales
    const [integraciones] = await db.promise().query(`
      SELECT i.*, c.nombre as cultivo_nombre, c.ubicacion 
      FROM integracion i
      LEFT JOIN cultivo c ON i.cultivo_id = c.id
      ORDER BY i.fecha_inicial DESC
    `);

    res.status(200).json(integraciones);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalles: error.message 
    });
  }
};

const obtenerIntegracionPorId = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener datos básicos de la integración
    const [integraciones] = await db.promise().query(`
        SELECT i.*, c.nombre as cultivo_nombre 
        FROM integracion i
        LEFT JOIN cultivo c ON i.cultivo_id = c.id
        WHERE i.id = ?
    `, [id]);

    if (integraciones.length === 0) {
        return res.status(404).json({ error: 'Integración no encontrada' });
    }

    const integracion = integraciones[0];

    // Obtener sensores asociados
    const [sensores] = await db.promise().query(`
        SELECT s.id, s.nombre 
        FROM integracion_sensor isr
        JOIN sensor s ON isr.sensor_id = s.id
        WHERE isr.integracion_id = ?
    `, [id]);

    // Obtener insumos asociados
    const [insumos] = await db.promise().query(`
      SELECT 
          ii.insumo_id as id, 
          i.nombre, 
          ii.cantidad, 
          i.unidad_medida as unidad
      FROM integracion_insumo ii
      JOIN insumo i ON ii.insumo_id = i.id
      WHERE ii.integracion_id = ?
    `, [id]);

    // Obtener ciclos asociados
    const [ciclos] = await db.promise().query(`
        SELECT cc.id, cc.nombre 
        FROM integracion_ciclo_cultivo icc
        JOIN ciclo_cultivo cc ON icc.ciclo_cultivo_id = cc.id
        WHERE icc.integracion_id = ?
    `, [id]);

    // Obtener operadores asociados
    const [operadores] = await db.promise().query(`
      SELECT u.id, u.nombre 
      FROM integracion_operador io
      JOIN usuario u ON io.operador_id = u.id
      WHERE io.integracion_id = ?
    `, [id]);

    // Obtener historial de consumos
    const [consumos] = await db.promise().query(`
      SELECT 
        ci.*, 
        i.nombre as insumo_nombre,
        u.nombre as operador_nombre,
        i.unidad_medida as unidad
      FROM consumo_insumos ci
      JOIN insumo i ON ci.insumo_id = i.id
      JOIN usuario u ON ci.operador_id = u.id
      WHERE ci.integracion_id = ?
      ORDER BY ci.fecha DESC
    `, [id]);

    res.status(200).json({
      ...integracion,
      sensores,
      insumos,
      ciclos,
      operadores,
      consumos
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalles: error.message 
    });
  }
};

const registrarConsumoInsumo = async (req, res) => {
  const { integracion_id, operador_id, insumo_id, cantidad } = req.body;

  if (!integracion_id || !operador_id || !insumo_id || !cantidad) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    await db.promise().beginTransaction();

    // 1. Verificar que el insumo existe en la integración y tiene suficiente cantidad
    const [insumoIntegracion] = await db.promise().query(
      `SELECT cantidad FROM integracion_insumo 
       WHERE integracion_id = ? AND insumo_id = ?`,
      [integracion_id, insumo_id]
    );

    if (insumoIntegracion.length === 0) {
      throw new Error('El insumo no está asignado a esta integración');
    }

    const cantidadDisponible = insumoIntegracion[0].cantidad;
    if (cantidadDisponible < cantidad) {
      throw new Error(`Cantidad insuficiente del insumo (Disponible: ${cantidadDisponible})`);
    }

    // 2. Registrar el consumo
    await db.promise().query(
      `INSERT INTO consumo_insumos 
       (integracion_id, operador_id, insumo_id, cantidad, fecha)
       VALUES (?, ?, ?, ?, NOW())`,
      [integracion_id, operador_id, insumo_id, cantidad]
    );

    // 3. Actualizar la cantidad disponible
    await db.promise().query(
      `UPDATE integracion_insumo 
       SET cantidad = cantidad - ? 
       WHERE integracion_id = ? AND insumo_id = ?`,
      [cantidad, integracion_id, insumo_id]
    );

    await db.promise().commit();

    res.status(201).json({ 
      message: 'Consumo registrado exitosamente',
      cantidad_restante: cantidadDisponible - cantidad
    });

  } catch (error) {
    await db.promise().rollback();
    res.status(500).json({ 
      error: 'Error al registrar consumo',
      detalles: error.message 
    });
  }
};

const obtenerConsumosInsumos = async (req, res) => {
  const { id } = req.params;

  try {
    const [consumos] = await db.promise().query(`
      SELECT 
        ci.*, 
        i.nombre as insumo_nombre,
        u.nombre as operador_nombre,
        i.unidad_medida as unidad
      FROM consumo_insumos ci
      JOIN insumo i ON ci.insumo_id = i.id
      JOIN usuario u ON ci.operador_id = u.id
      WHERE ci.integracion_id = ?
      ORDER BY ci.fecha DESC
    `, [id]);

    res.status(200).json(consumos);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener consumos',
      detalles: error.message 
    });
  }
};

const actualizarIntegracion = async (req, res) => {
  const { id } = req.params;
  let {
    nombre,
    cultivo_id,
    estado,
    fecha_inicial,
    fecha_final,
    sensores,
    insumos,
    ciclos,
    operadores
  } = req.body;

  try {
    // Parsear arrays si vienen como strings
    sensores = typeof sensores === 'string' ? JSON.parse(sensores) : (sensores || []);
    insumos = typeof insumos === 'string' ? JSON.parse(insumos) : (insumos || []);
    ciclos = typeof ciclos === 'string' ? JSON.parse(ciclos) : (ciclos || []);
    operadores = typeof operadores === 'string' ? JSON.parse(operadores) : (operadores || []);
  } catch (err) {
    return res.status(400).json({ error: 'Error al parsear arrays del cuerpo', detalles: err.message });
  }

  const fotografia = req.file ? req.file.filename : null;

  try {
    await db.promise().beginTransaction();

    // Actualizar datos principales
    const updateQuery = `
      UPDATE integracion SET
        nombre = ?,
        cultivo_id = ?,
        estado = ?,
        fecha_inicial = ?,
        fecha_final = ?
        ${fotografia ? ', fotografia = ?' : ''}
      WHERE id = ?
    `;

    const queryParams = [
      nombre,
      cultivo_id || null,
      estado,
      fecha_inicial,
      fecha_final,
      ...(fotografia ? [fotografia] : []),
      id
    ];

    await db.promise().query(updateQuery, queryParams);

    // Actualizar relaciones (eliminar existentes y crear nuevas)
    await actualizarRelaciones('integracion_sensor', id, sensores);
    await actualizarRelaciones('integracion_ciclo_cultivo', id, ciclos);
    await actualizarRelaciones('integracion_operador', id, operadores);

    // Actualizar insumos (manejo especial por la cantidad)
    await actualizarInsumos(id, insumos);

    await db.promise().commit();

    res.status(200).json({ 
      message: 'Integración actualizada exitosamente',
      id: id
    });

  } catch (error) {
    await db.promise().rollback();
    res.status(500).json({ 
      error: 'Error al actualizar integración',
      detalles: error.message 
    });
  }
};

async function actualizarRelaciones(tabla, integracionId, items) {
  // Eliminar relaciones existentes
  await db.promise().query(
    `DELETE FROM ${tabla} WHERE integracion_id = ?`,
    [integracionId]
  );

  // Insertar nuevas relaciones
  if (items.length > 0) {
    await insertarRelaciones(tabla, integracionId, items);
  }
}

async function actualizarInsumos(integracionId, insumos) {
  // Eliminar insumos existentes
  await db.promise().query(
    `DELETE FROM integracion_insumo WHERE integracion_id = ?`,
    [integracionId]
  );

  // Insertar nuevos insumos
  if (insumos.length > 0) {
    for (const insumo of insumos) {
      await db.promise().query(
        `INSERT INTO integracion_insumo 
         (integracion_id, insumo_id, cantidad)
         VALUES (?, ?, ?)`,
        [integracionId, insumo.id, insumo.cantidad || 1]
      );
    }
  }
}

const eliminarIntegracion = async (req, res) => {
  const { id } = req.params;

  try {
    await db.promise().beginTransaction();

    // Eliminar relaciones primero
    await db.promise().query('DELETE FROM integracion_sensor WHERE integracion_id = ?', [id]);
    await db.promise().query('DELETE FROM integracion_insumo WHERE integracion_id = ?', [id]);
    await db.promise().query('DELETE FROM integracion_ciclo_cultivo WHERE integracion_id = ?', [id]);
    await db.promise().query('DELETE FROM integracion_operador WHERE integracion_id = ?', [id]);
    await db.promise().query('DELETE FROM consumo_insumos WHERE integracion_id = ?', [id]);

    // Eliminar la integración
    const [result] = await db.promise().query('DELETE FROM integracion WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      throw new Error('Integración no encontrada');
    }

    await db.promise().commit();

    res.status(200).json({ 
      message: 'Integración eliminada exitosamente',
      id: id
    });

  } catch (error) {
    await db.promise().rollback();
    res.status(500).json({ 
      error: 'Error al eliminar integración',
      detalles: error.message 
    });
  }
};

module.exports = {
  crearIntegracion,
  obtenerIntegraciones,
  obtenerIntegracionPorId,
  registrarConsumoInsumo,
  obtenerConsumosInsumos,
  actualizarIntegracion,
  eliminarIntegracion,
  upload
};  