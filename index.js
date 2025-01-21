const express = require('express');
const usuariosRouter = require('./usuarios');
const deportesRouter = require('./deportes');
const app = express();
const port = 8080;

app.use(express.json());
app.use(usuariosRouter); // Usa las rutas de usuarios
app.use(deportesRouter); // Usa las rutas de deportes

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
