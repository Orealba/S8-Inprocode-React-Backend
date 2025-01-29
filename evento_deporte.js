const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
};

router.use(cors(corsOptions));

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

//POST TABLA evento_deporte
router.post('/evento_deporte', async (req, res) => {
  const { titulo, fecha_inicio, fecha_fin } = req.body;

  if (!titulo || !fecha_inicio || !fecha_fin) {
    return res
      .status(400)
      .send('titulo, fecha_inicio, y fecha_fin son requeridos');
  }

  try {
    const query = `
        INSERT INTO evento_deporte (titulo, fecha_inicio, fecha_fin)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const values = [titulo, fecha_inicio, fecha_fin];

    const result = await pool.query(query, values);
    res.status(201).send({
      message: 'Nuevo evento_deporte creado',
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ha ocurrido un error');
  }
});

//GET TABLE evento_deporte

router.get('/evento_deporte', async (req, res) => {
  try {
    const query = 'SELECT * FROM evento_deporte;';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
});

//GET specific user

router.get('/evento_deporte/:id', async (req, res) => {
  try {
    const [id] = req.params['id'];

    const query = `
        SELECT e.id, e.created_at, e.titulo, e.fecha_inicio, e.fecha_fin
        FROM evento_deporte e
        WHERE e.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send('this evento is not in the database');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
});

//PUT
router.put('/evento_deporte/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, hora_inicio, hora_fin, descripcion, usuario_id } = req.body;

    if (!titulo && !hora_inicio && !hora_fin && !descripcion && !usuario_id) {
      return res
        .status(400)
        .send(
          'provide a field (titulo, hora_inicio, hora_fin, descripcion or usuario_id)',
        );
    }

    const query = `
        UPDATE evento_deporte
        SET titulo = COALESCE($1, titulo),
            hora_inicio = COALESCE($2, hora_inicio),
            hora_fin = COALESCE($3, hora_fin),
            descripcion = COALESCE($4, descripcion),
            usuario_id = COALESCE($5, usuario_id)
            
        WHERE id = $6
        RETURNING *;
      `;
    const { rows } = await pool.query(query, [
      titulo,
      hora_inicio,
      hora_fin,
      descripcion,
      usuario_id,
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).send('Cannot find anything');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Some error has occured failed');
  }
});

//DELETE
router.delete('/evento_deporte/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM evento_deporte WHERE id = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send('we have not found the evento');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('some error has occured');
  }
});
module.exports = router;
