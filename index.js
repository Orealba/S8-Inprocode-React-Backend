const express = require('express');
const cors = require('cors');
const usuariosRouter = require('./usuarios');
const deportesRouter = require('./deportes');
const usuarioDeporteRouter = require('./usuario_deporte');
const eventoDeporteRouter = require('./evento_deporte');
const app = express();
const port = 8080;


const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));


app.use(express.json());

app.use(usuariosRouter); 
app.use(deportesRouter); 
app.use(usuarioDeporteRouter); 
app.use(eventoDeporteRouter); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
