const db = require('../config/db');

const crearIntegracion = async (req, res) => {
  const { 
    nombre, 
    cultivo_id, 
    estado, 
    fecha_inicial, 
    fecha_final, 
    fotografia,
    sensores = [], 
    insumos = [], 
    ciclos = [], 
    operadores = [] 
  } = req.body;

  // Validación básica
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

    // 1. Insertar integración principal
    const [result] = await db.promise().query(
      `INSERT INTO integracion 
       (nombre, cultivo_id, estado, fecha_inicial, fecha_final, fotografia)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, cultivo_id || null, estado, fecha_inicial, fecha_final, fotografia || null]
    );

    const integracionId = result.insertId;

    // 2. Insertar relaciones
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
  if (!items || items.length === 0) return;
  
  const placeholders = items.map(() => '(?, ?)').join(',');
  const values = items.flatMap(id => [integracionId, id]);
  
  await db.promise().query(
    `INSERT INTO ${tabla} VALUES ${placeholders}`,
    values
  );
}

module.exports = {
  crearIntegracion
};