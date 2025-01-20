import React, { useState } from "react";
import PackageForm from "./components/PackageForm";
import PackageLabel from "./components/PackageLabel";

const App = () => {
  const [packageData, setPackageData] = useState(null);

  // Maneja la generación de etiquetas desde el formulario
  const handleGenerateLabel = (data) => {
    setPackageData(data); // Actualiza los datos del paquete
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Generador de Etiquetas</h1>
      <div style={styles.content}>
        {/* Formulario para capturar datos */}
        <div style={styles.formSection}>
          <h2>Formulario de Captura</h2>
          <PackageForm onGenerateLabel={handleGenerateLabel} />
        </div>

        {/* Etiqueta generada */}
        <div style={styles.labelSection}>
          <h2>Etiqueta</h2>
          <PackageLabel packageData={packageData} />
        </div>
      </div>
    </div>
  );
};

// Estilos en línea para mejorar el diseño
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "0 auto",
    padding: "20px",
    maxWidth: "800px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
  },
  formSection: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  labelSection: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
};

export default App;
