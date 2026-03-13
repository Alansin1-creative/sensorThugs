// Importamos express para crear el servidor
const express = require("express");

// Importamos mongoose para conectar MongoDB
const mongoose = require("mongoose");

// Importamos cors para permitir conexiones desde la app
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// Conexión a MongoDB Compass
mongoose.connect("mongodb://127.0.0.1:27017/sensorThugs", {
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

    res.status(500).send("Error");

  }

});



// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});