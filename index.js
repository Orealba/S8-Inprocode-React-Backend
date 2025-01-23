const express = require('express');
const usuariosRouter = require('./usuarios');
const deportesRouter = require('./deportes');
const usuarioDeporteRouter = require('./usuario_deporte');
const app = express();
const port = 8080;

app.use(express.json());
app.use(usuariosRouter); // Usa las rutas de usuarios
app.use(deportesRouter); // Usa las rutas de deportes
app.use(usuarioDeporteRouter); // Usa las rutas de usuario_deporte

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
