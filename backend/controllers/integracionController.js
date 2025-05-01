const db = require('../config/db');
const path = require('path');
const fs = require('fs');

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
  
  // 👇 Esto parsea si vienen como strings desde el form-data
  try {
    sensores = typeof sensores === 'string' ? JSON.parse(sensores) : (sensores || []);
    insumos = typeof insumos === 'string' ? JSON.parse(insumos) : (insumos || []);
    ciclos = typeof ciclos === 'string' ? JSON.parse(ciclos) : (ciclos || []);
    operadores = typeof operadores === 'string' ? JSON.parse(operadores) : (operadores || []);
  } catch (err) {
    return res.status(400).json({ error: 'Error al parsear arrays del cuerpo', detalles: err.message });
  }
  

  const fotografia = req.file ? req.file.filename : null; // Aquí tomas el nombre del archivo

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
    `);

    res.status(200).json(integraciones);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalles: error.message 
    });
  }
};

module.exports = {
  crearIntegracion,
  obtenerIntegraciones
};
