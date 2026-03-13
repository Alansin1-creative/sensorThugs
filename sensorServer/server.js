// Importamos express para crear el servidor
const express = require("express");

// Importamos mongoose para conectar MongoDB
const mongoose = require("mongoose");

// Importamos cors para permitir conexiones desde la app
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas (se lee desde la variable de entorno MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Modelo para guardar eventos
const EventoSchema = new mongoose.Schema({
  evento: String,
  fecha: Date,
});

const Evento = mongoose.model("Evento", EventoSchema);

// Ruta para guardar evento
app.post("/evento", async (req, res) => {
  try {
    const nuevoEvento = new Evento({
      evento: req.body.evento,
      fecha: new Date(),
    });

    await nuevoEvento.save();

    res.send("Evento guardado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

// Iniciar servidor (Railway asigna el puerto en process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});