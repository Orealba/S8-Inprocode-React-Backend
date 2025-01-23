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

//POST TABLA evento_deporte
router.post('/evento_deporte', async (req, res) => {
  // Validate the incoming JSON data
  const { titulo, hora_inicio, hora_fin, descripcion, usuario_id } = req.body;
  console.log(req.body);
  if (!titulo || !hora_inicio || !hora_fin || !descripcion || !usuario_id) {
    return res
      .status(400)
      .send(
        'One of the: titulo, hora_inicio, hora_fin, descripcion or usuario_id  is missing in the data',
      );
  }

  try {
    // try to send data to the database
    const query = `
        INSERT INTO evento_deporte (titulo, hora_inicio, hora_fin, descripcion, usuario_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
    const values = [titulo, hora_inicio, hora_fin, descripcion, usuario_id];

    const result = await pool.query(query, values);
    console.log(result);
    res.status(201).send({
      message: 'New evento_deporte created',
      usuarioId: result.rows[0].id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('some error has occured');
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

    const query = 'SELECT * FROM evento_deporte WHERE id = $1;';
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
