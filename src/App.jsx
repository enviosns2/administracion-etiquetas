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
    padding: "clamp(15px, 5vw, 20px)",
    maxWidth: "100%",
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "clamp(15px, 4vw, 20px)",
    fontSize: "clamp(24px, 6vw, 32px)",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(15px, 3vw, 20px)",
    "@media (min-width: 768px)": {
      flexDirection: "row",
    },
  },
  formSection: {
    flex: 1,
    padding: "clamp(12px, 3vw, 16px)",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    minWidth: 0,
  },
  labelSection: {
    flex: 1,
    padding: "clamp(12px, 3vw, 16px)",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    minWidth: 0,
  },
};

export default App;
