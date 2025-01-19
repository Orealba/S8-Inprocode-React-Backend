const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 8080;

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!!!!xxx!!');
});

//POST TABLA USERS
app.post('/usuarios', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
