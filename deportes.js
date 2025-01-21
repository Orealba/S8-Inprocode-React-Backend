const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

//post deportes
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

module.exports = router;
