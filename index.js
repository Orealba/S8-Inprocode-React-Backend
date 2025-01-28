const express = require('express');
const cors = require('cors');
const usuariosRouter = require('./usuarios');
const deportesRouter = require('./deportes');
const usuarioDeporteRouter = require('./usuario_deporte');
const eventoDeporteRouter = require('./evento_deporte');
const app = express();
const port = 8080;

// Configurar CORS antes de las rutas
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

app.use(usuariosRouter); // Usa las rutas de usuarios
app.use(deportesRouter); // Usa las rutas de deportes
app.use(usuarioDeporteRouter); // Usa las rutas de usuario_deporte
app.use(eventoDeporteRouter); // Usa las rutas de evento_deporte

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
