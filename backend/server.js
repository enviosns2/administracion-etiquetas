const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

console.log("Cargando variables de entorno desde .env...");
console.log("MONGO_URI:", process.env.MONGO_URI || "No configurada");
console.log("PORT:", process.env.PORT || "No configurado");
console.log("NODE_ENV:", process.env.NODE_ENV || "No configurado");
console.log("VITE_API_URL:", process.env.VITE_API_URL || "No configurada");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);
mongoose.set("runValidators", true);

let retryCount = 0;
const MAX_RETRIES = 5;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conexión exitosa a MongoDB");
  } catch (err) {
    retryCount++;
    console.error(`Error al conectar con MongoDB (Intento ${retryCount}):`, err.message);
    if (retryCount < MAX_RETRIES) {
      console.log("Reintentando conexión en 5 segundos...");
      setTimeout(connectToDatabase, 5000);
    } else {
      console.error("Número máximo de reintentos alcanzado. Finalizando proceso.");
      process.exit(1);
    }
  }
};
connectToDatabase();

mongoose.connection.on("connected", () => console.log("Conexión a MongoDB establecida."));
mongoose.connection.on("error", (err) => console.error("Error en la conexión a MongoDB:", err.message));
mongoose.connection.on("disconnected", () => console.log("Desconectado de MongoDB."));

const PackageSchema = new mongoose.Schema({
  paquete_id: { type: String, required: true },
  estado_actual: { type: String, default: "Recibido" },
  historial: [
    { estado: { type: String, required: true }, fecha: { type: Date, default: Date.now } },
  ],
  sender: { type: String, required: true },
  street: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  dimensions: { type: String, required: true },
  weight: { type: String, required: true },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Package = mongoose.model("Estado", PackageSchema, "estados");

app.get("/api", (req, res) => res.send("API funcionando correctamente"));

app.post("/api/packages", async (req, res) => {
  try {
    console.log("Datos recibidos para crear paquete:", req.body);

    const { uniqueCode, ...rest } = req.body;
    if (!uniqueCode) return res.status(400).json({ error: "El uniqueCode es obligatorio." });

    const newPackage = new Package({
      paquete_id: uniqueCode,
      estado_actual: "Recibido",
      historial: [{ estado: "Recibido", fecha: new Date() }],
      ...rest,
    });

    const savedPackage = await newPackage.save();
    console.log("Paquete creado exitosamente:", savedPackage);
    res.status(201).json(savedPackage);
  } catch (err) {
    console.error("Error al crear paquete:", err.message);
    res.status(500).json({ error: "Error al guardar el paquete" });
  }
});

app.get("/healthz", (req, res) => {
  console.log("Verificación de salud ejecutada");
  res.status(200).send("OK");
});

if (process.env.NODE_ENV === "production") {
  console.log("Modo producción: Sirviendo archivos estáticos del frontend");
  const staticPath = path.join(__dirname, "dist");
  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    const indexPath = path.resolve(staticPath, "index.html");
    fs.access(indexPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("Archivo index.html no encontrado:", err.message);
        return res.status(404).send("Archivo no encontrado");
      }
      res.sendFile(indexPath);
    });
  });
} else {
  console.log("Modo desarrollo: API lista para usarse");
  app.get("/", (req, res) => res.send("Servidor en desarrollo"));
}

process.on("uncaughtException", (err) => {
  console.error("Excepción no controlada:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("Promesa no manejada:", reason);
});

app.listen(PORT, (err) => {
  if (err) {
    console.error("Error al iniciar el servidor:", err.message);
  } else {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  }
});
