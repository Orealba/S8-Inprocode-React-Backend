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

//post tabla deportes
router.post('/deportes', async (req, res) => {
  // Validate the incoming JSON data
  const { nombre } = req.body;
  console.log(req.body);
  if (!nombre) {
    return res.status(400).send('Nombre is missing in the data');
  }

  try {
    // try to send data to the database
    const query = `
          INSERT INTO deportes (nombre)
          VALUES ($1)
          RETURNING id;
        `;
    const values = [nombre];

    const result = await pool.query(query, values);
    console.log(result);
    res
      .status(201)
      .send({ message: 'New deporte created', usuarioId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send('some error has occured');
  }
});

//GET TABLE DEPORTES

router.get('/deportes', async (req, res) => {
  try {
    const query = 'SELECT * FROM deportes;';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
});

//GET specific deporte
//
router.get('/deportes/:id', async (req, res) => {
  try {
    const id = req.params['id'];

    const query = `SELECT d.*, array_agg(json_build_object('nombre', u.nombre, 'apellido', u.apellido, 'edad', u.edad)) AS usuarios
        FROM deportes d
        LEFT JOIN usuario_deporte ud ON d.id = ud.deporte_id
        LEFT JOIN usuarios u ON ud.usuario_id = u.id
        WHERE d.id = $1
        GROUP BY d.id;`;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send('this deporte is not in the database');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
});

//PUT
router.put('/deportes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).send('provide a field (nombre)');
    }

    const query = `
          UPDATE deportes
          SET nombre = COALESCE($1, nombre)
              
          WHERE id = $2
          RETURNING *;
        `;

    const { rows } = await pool.query(query, [nombre, id]);

    if (rows.length === 0) {
      return res.status(404).send('Cannot find anything');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Some error has occured failed ${err.message}`);
  }
});

//DELETE
router.delete('/deportes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM deportes WHERE id = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send('we have not found deporte');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('some error has occured');
  }
});

module.exports = router;
