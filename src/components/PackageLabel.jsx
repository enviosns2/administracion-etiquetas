import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";

const PackageLabel = ({ packageData }) => {
  const barcodeCanvasRef = useRef(); // Cambiado de SVG a canvas

  // Genera un código único basado en la información del paquete
  const uniqueCode = packageData ? generateUniqueCode(packageData) : "";

  // Renderiza el código de barras cuando uniqueCode cambia
  useEffect(() => {
    if (barcodeCanvasRef.current && uniqueCode) {
      JsBarcode(barcodeCanvasRef.current, uniqueCode, {
        format: "CODE128",
        lineColor: "#000",
        width: 4, // Más ancho
        height: 80, // Más alto
        displayValue: true,
      });
    }
  }, [uniqueCode]);

  // Manejar la generación de PDF
  const handleGeneratePDF = () => {
    if (!packageData) {
      alert("No hay datos para generar un PDF.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 30; // Posición inicial vertical

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16); // Texto más grande
    doc.text("ETIQUETA GENERADA", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    doc.setFontSize(14); // Ajuste de tamaño del texto
    doc.text(`PAÍS: ${packageData.country || "N/A"}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.text(`AGENCIA: ${packageData.agency || "N/A"}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.text(`REMITE: ${packageData.sender.toUpperCase()}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.text(`CALLE Y NÚMERO: ${packageData.street.toUpperCase()}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.text(`CÓDIGO POSTAL: ${packageData.postalCode.toUpperCase()}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.text(
      `CIUDAD: ${
        packageData.city === "otro"
          ? packageData.customCity.toUpperCase()
          : packageData.city.toUpperCase()
      }`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 10;
    doc.text(
      `DIMENSIONES: ${
        packageData.dimensions === "otro"
          ? packageData.customDimensions.toUpperCase()
          : packageData.dimensions.toUpperCase()
      }`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 10;
    doc.text(`PESO: ${packageData.weight} LB`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.text(`CANTIDAD: ${packageData.quantity}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    doc.text(`CÓDIGO ÚNICO: ${uniqueCode}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 20;

    // Agregar el código de barras como imagen
    const barcodeImage = barcodeCanvasRef.current.toDataURL("image/png");
    doc.addImage(barcodeImage, "PNG", pageWidth / 2 - 50, yPosition, 100, 30); // Código de barras centrado
    yPosition += 50;

    // Nombre automático del PDF: Remitente + Fecha de creación
    const date = new Date().toLocaleDateString("es-MX").replace(/\//g, "-"); // Fecha con formato dd-mm-yyyy
    const pdfName = `${packageData.sender.toUpperCase()}-${date}.pdf`;

    doc.save(pdfName);
  };

  // Manejar la impresión directa
  const handlePrint = () => {
    window.print();
  };

  if (!packageData) {
    return (
      <p style={{ fontSize: "clamp(14px, 4vw, 16px)", color: "#666" }}>
        No hay datos para mostrar. Completa el formulario para generar una etiqueta.
      </p>
    );
  }

  const labelStyle = {
    fontSize: "clamp(14px, 4vw, 16px)",
    margin: "clamp(6px, 2vw, 10px) 0",
  };

  const strongStyle = {
    fontWeight: "600",
  };

  const buttonsContainerStyle = {
    marginTop: "clamp(16px, 4vw, 20px)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(8px, 2vw, 12px)",
  };

  const buttonStyle = {
    flex: 1,
    padding: "clamp(12px, 3vw, 16px)",
    fontSize: "clamp(14px, 4vw, 16px)",
    fontWeight: "600",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    minHeight: "44px",
    width: "100%",
  };

  const barcodeContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "clamp(16px, 4vw, 20px) 0",
    padding: "clamp(12px, 3vw, 16px)",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    overflow: "auto",
  };

  return (
    <div style={{ width: "100%", padding: "0" }}>
      <h2 style={{ fontSize: "clamp(18px, 5vw, 24px)", marginBottom: "clamp(12px, 3vw, 16px)" }}>
        Etiqueta Generada
      </h2>
      
      <p style={labelStyle}>
        <span style={strongStyle}>País:</span> {packageData.country || "N/A"}
      </p>
      <p style={labelStyle}>
        <span style={strongStyle}>Agencia:</span> {packageData.agency || "N/A"}
      </p>
      <p style={labelStyle}>
        <span style={strongStyle}>Remitente:</span> {packageData.sender.toUpperCase()}
      </p>
      <p style={labelStyle}>
        <span style={strongStyle}>Calle y número:</span> {packageData.street.toUpperCase()}
      </p>
      <p style={labelStyle}>
        <span style={strongStyle}>Código postal:</span> {packageData.postalCode.toUpperCase()}
      </p>
      <p style={labelStyle}>
        <span style={strongStyle}>Ciudad:</span>{" "}
        {packageData.city === "otro"
          ? packageData.customCity.toUpperCase()
          : packageData.city.toUpperCase()}
      </p>
      <p style={labelStyle}>
        <span style={strongStyle}>Dimensiones:</span>{" "}
        {packageData.dimensions === "otro"
          ? packageData.customDimensions.toUpperCase()
          : packageData.dimensions.toUpperCase()}
      </p>
      <p style={labelStyle}>
        <span style={strongStyle}>Peso:</span> {packageData.weight} LB
      </p>
      <p style={labelStyle}>
        <span style={strongStyle}>Cantidad:</span> {packageData.quantity}
      </p>

      {/* Código único y código de barras */}
      <div style={{ margin: "clamp(12px, 3vw, 16px) 0" }}>
        <p style={labelStyle}>
          <span style={strongStyle}>Código único:</span> <br />
          <span style={{ fontFamily: "monospace", fontSize: "clamp(12px, 3vw, 14px)", fontWeight: "600" }}>
            {uniqueCode}
          </span>
        </p>
        
        <div style={barcodeContainerStyle}>
          <canvas ref={barcodeCanvasRef}></canvas>
        </div>
      </div>

      {/* Botones para descargar PDF e imprimir */}
      <div style={buttonsContainerStyle}>
        <button 
          onClick={handleGeneratePDF} 
          style={buttonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#0b7dda"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#2196F3"}
        >
          📥 Descargar como PDF
        </button>
        <button 
          onClick={handlePrint}
          style={{ ...buttonStyle, backgroundColor: "#4CAF50" }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#45a049"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#4CAF50"}
        >
          🖨️ Imprimir Etiqueta
        </button>
      </div>
    </div>
  );
};

// Función para generar un código único basado en la información del paquete
function generateUniqueCode(packageData) {
  const timestamp = Date.now().toString(36); // Marca de tiempo en base 36
  const clientPrefix = packageData.sender.slice(0, 3).toUpperCase(); // Primeras 3 letras del remitente
  const cityPrefix =
    packageData.city === "otro"
      ? packageData.customCity.slice(0, 3).toUpperCase() // Primeras 3 letras de la ciudad personalizada
      : packageData.city.slice(0, 3).toUpperCase(); // Primeras 3 letras de la ciudad seleccionada
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 caracteres aleatorios

  return `${clientPrefix}-${cityPrefix}-${timestamp}-${randomString}`;
}

export default PackageLabel;
