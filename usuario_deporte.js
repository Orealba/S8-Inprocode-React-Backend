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


router.post('/usuario_deporte', async (req, res) => {

  const { usuario_id, deporte_id } = req.body;
  console.log(req.body);
  if (!usuario_id || !deporte_id) {
    return res
      .status(400)
      .send('One of the:  usuario_id or deporte_id  is missing in the data');
  }

  try {
    
    const query = `
        INSERT INTO usuario_deporte (usuario_id, deporte_id)
        VALUES ($1, $2)
        RETURNING id;
      `;
    const values = [usuario_id, deporte_id];

    const result = await pool.query(query, values);
    console.log(result);
    res
      .status(201)
      .send({ message: 'New relación created', usuarioId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send('some error has occured');
  }
});



router.get('/usuario_deporte', async (req, res) => {
  try {
    const query = 'SELECT * FROM usuario_deporte;';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
});



router.get('/usuario_deporte/:id', async (req, res) => {
  try {
    const [id] = req.params['id'];

    const query = 'SELECT * FROM usuario_deporte WHERE id = $1;';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send('this relación is not in the database');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
});


router.put('/usuario_deporte/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id, deporte_id } = req.body;

    if (!usuario_id && !deporte_id) {
      return res.status(400).send('provide a field (usuario_id or deporte_id)');
    }

    const query = `
        UPDATE usuario_deporte
        SET usuario_id = COALESCE($1, usuario_id),
            deporte_id = COALESCE($2, deporte_id)
            
        WHERE id = $3
        RETURNING *;
      `;
    const { rows } = await pool.query(query, [usuario_id, deporte_id, id]);

    if (rows.length === 0) {
      return res.status(404).send('Cannot find anything');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Some error has occured failed');
  }
});


router.delete('/usuario_deporte/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM usuario_deporte WHERE id = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send('we have not found the relación');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('some error has occured');
  }
});
module.exports = router;
