const path = require("path");
const fs = require("fs"); // Importar fs
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Logs para verificar las variables de entorno
console.log("Cargando variables de entorno desde .env...");
console.log("MONGO_URI:", process.env.MONGO_URI || "No configurada");
console.log("PORT:", process.env.PORT || "No configurado");
console.log("VITE_API_URL:", process.env.VITE_API_URL || "No configurada");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Mongoose
mongoose.set("strictQuery", true);
mongoose.set("runValidators", true);

// Conectar a MongoDB con reintentos automáticos
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conexión exitosa a MongoDB");
  } catch (err) {
    console.error("Error al conectar con MongoDB. Reintentando en 5 segundos...", err.message);
    setTimeout(connectToDatabase, 5000); // Reintentar después de 5 segundos
  }
};
connectToDatabase();

// Eventos de conexión de MongoDB
mongoose.connection.on("connected", () => console.log("Conexión a MongoDB establecida."));
mongoose.connection.on("error", (err) => console.error("Error en la conexión a MongoDB:", err.message));
mongoose.connection.on("disconnected", () => console.log("Desconectado de MongoDB."));

// Esquema y modelo de MongoDB
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

// Rutas de la API
app.get("/api", (req, res) => res.send("API funcionando correctamente"));

// Crear un nuevo paquete
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

// Verificación de salud para Render
app.get("/healthz", (req, res) => {
  console.log("Verificación de salud ejecutada");
  res.status(200).send("OK");
});

// Configuración del frontend en producción
if (process.env.NODE_ENV === "production") {
  console.log("Modo producción: Sirviendo archivos estáticos del frontend");
  const staticPath = path.join(__dirname, "dist");
  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    const indexPath = path.resolve(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Archivo no encontrado");
    }
  });
} else {
  console.log("Modo desarrollo: API lista para usarse");
  app.get("/", (req, res) => res.send("Servidor en desarrollo"));
}

// Iniciar el servidor
app.listen(PORT, (err) => {
  if (err) {
    console.error("Error al iniciar el servidor:", err.message);
  } else {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  }
});
