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

//POST TABLA USERS
router.post('/usuarios', async (req, res) => {
  // Validate the incoming JSON data
  const { nombre, apellido, email, telefono, direccion, latitud, longitud } =
    req.body;
  console.log(req.body);
  if (
    !nombre ||
    !apellido ||
    !email ||
    !telefono ||
    !direccion ||
    !latitud ||
    !longitud
  ) {
    return res
      .status(400)
      .send(
        'One of the:  nombre, apellido, email, telefono, direccion, latitud or longitud is missing in the data',
      );
  }

  try {
    // try to send data to the database
    const query = `
        INSERT INTO usuarios (nombre, apellido, email, telefono, direccion, latitud, longitud)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `;
    const values = [
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      latitud,
      longitud,
    ];

    const result = await pool.query(query, values);
    console.log(result);
    res
      .status(201)
      .send({ message: 'New user created', usuarioId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send('some error has occured');
  }
});

//GET TABLE USERS

router.get('/usuarios', async (req, res) => {
  try {
    const query = 'SELECT * FROM usuarios;';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
});

//GET specific user

router.get('/usuarios/:id', async (req, res) => {
  try {
    const [id] = req.params['id'];

    const query = 'SELECT * FROM usuarios WHERE id = $1;';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send('this user is not in the database');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('failed');
  }
});

//PUT
router.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, direccion, latitud, longitud } =
      req.body;

    if (
      !nombre &&
      !apellido &&
      !email &&
      !telefono &&
      !direccion &&
      !latitud &&
      !longitud
    ) {
      return res
        .status(400)
        .send(
          'provide a field (nombre, apellido, email, telefono, direccion, latitud, longitud)',
        );
    }

    const query = `
        UPDATE usuarios
        SET nombre = COALESCE($1, nombre),
            apellido = COALESCE($2, apellido),
            email = COALESCE($3, email),
            telefono = COALESCE($4, telefono),
            direccion = COALESCE($5, direccion),
            latitud = COALESCE($6, latitud),
            longitud = COALESCE($7, longitud)
        WHERE id = $8
        RETURNING *;
      `;
    const { rows } = await pool.query(query, [
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      latitud,
      longitud,
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
router.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send('we have not found the user');
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('some error has occured');
  }
});
module.exports = router;
