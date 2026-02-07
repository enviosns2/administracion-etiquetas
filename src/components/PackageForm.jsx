import React, { useState } from "react";
import axios from "axios";

const PackageForm = ({ onGenerateLabel }) => {
  const [formData, setFormData] = useState({
    sender: "",
    street: "",
    postalCode: "",
    city: "",
    customCity: "",
    dimensions: "",
    customDimensions: "",
    weight: "",
    quantity: "", // Campo para cantidad
  });

  // URL del backend desplegado en Render
  const API_URL =
  process.env.NODE_ENV === "production"
    ? "/api/packages"
    : "http://localhost:3000/api/packages";

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Genera un código único basado en los datos del formulario
  const generateUniqueCode = (data) => {
    const timestamp = Date.now().toString(36); // Marca de tiempo en base 36
    const clientPrefix = data.sender.slice(0, 3).toUpperCase(); // Primeras 3 letras del remitente
    const cityPrefix =
      data.city === "otro"
        ? data.customCity.slice(0, 3).toUpperCase() // Ciudad personalizada
        : data.city.slice(0, 3).toUpperCase(); // Ciudad seleccionada
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase(); // Cadena aleatoria

    return `${clientPrefix}-${cityPrefix}-${timestamp}-${randomString}`;
  };

  // Limpia los datos del formulario
  const resetForm = () => {
    setFormData({
      sender: "",
      street: "",
      postalCode: "",
      city: "",
      customCity: "",
      dimensions: "",
      customDimensions: "",
      weight: "",
      quantity: "",
    });
  };

  // Validación de campos obligatorios
  const isFormValid = () => {
    const {
      sender,
      street,
      postalCode,
      city,
      customCity,
      dimensions,
      customDimensions,
      weight,
      quantity,
    } = formData;

    return (
      sender &&
      street &&
      postalCode &&
      weight &&
      quantity &&
      (city !== "otro" || customCity) &&
      (dimensions !== "otro" || customDimensions)
    );
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const uniqueCode = generateUniqueCode(formData);

    // Construir el paquete con los datos del formulario
    const packageData = {
      paquete_id: uniqueCode,
      uniqueCode,
      sender: formData.sender,
      street: formData.street,
      postalCode: formData.postalCode,
      city: formData.city === "otro" ? formData.customCity : formData.city,
      dimensions:
        formData.dimensions === "otro"
          ? formData.customDimensions
          : formData.dimensions,
      weight: formData.weight,
      quantity: formData.quantity,
    };

    // Mostrar la etiqueta en el frontend
    onGenerateLabel(packageData);

    // Enviar los datos al backend
    try {
      const response = await axios.post(API_URL, packageData);
      console.log("Paquete guardado en la base de datos:", response.data);
      alert("Paquete guardado con éxito.");
      resetForm();
    } catch (error) {
      console.error("Error al guardar el paquete:", error);
      alert(
        "Hubo un error al intentar guardar el paquete. Por favor, intenta nuevamente."
      );
    }
  };

  const formFieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "clamp(8px, 2vw, 12px)",
  };

  const labelStyle = {
    fontWeight: "600",
    fontSize: "clamp(14px, 4vw, 16px)",
    color: "#333",
  };

  const inputStyle = {
    padding: "clamp(10px, 3vw, 12px)",
    fontSize: "clamp(14px, 4vw, 16px)",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  };

  const buttonStyle = {
    marginTop: "clamp(16px, 4vw, 24px)",
    padding: "clamp(12px, 3vw, 16px)",
    fontSize: "clamp(16px, 4vw, 18px)",
    fontWeight: "600",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "100%",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 2vw, 12px)" }}
    >
      {/* Campos del formulario */}
      <div style={formFieldStyle}>
        <label style={labelStyle}>Remitente:</label>
        <input
          type="text"
          name="sender"
          value={formData.sender}
          onChange={handleChange}
          placeholder="Nombre del remitente"
          style={inputStyle}
          required
        />
      </div>
      
      <div style={formFieldStyle}>
        <label style={labelStyle}>Calle y número:</label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Calle y número"
          style={inputStyle}
          required
        />
      </div>
      
      <div style={formFieldStyle}>
        <label style={labelStyle}>Código postal:</label>
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="Código postal"
          style={inputStyle}
          required
        />
      </div>
      
      <div style={formFieldStyle}>
        <label style={labelStyle}>Ciudad:</label>
        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          style={selectStyle}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="Jalisco">Jalisco</option>
          <option value="Michoacán">Michoacán</option>
          <option value="Guanajuato">Guanajuato</option>
          <option value="otro">Otro</option>
        </select>
        {formData.city === "otro" && (
          <input
            type="text"
            name="customCity"
            value={formData.customCity}
            onChange={handleChange}
            placeholder="Especifica la ciudad"
            style={{ ...inputStyle, marginTop: "8px" }}
            required
          />
        )}
      </div>
      
      <div style={formFieldStyle}>
        <label style={labelStyle}>Dimensiones (LxWxH en pulgadas):</label>
        <select
          name="dimensions"
          value={formData.dimensions}
          onChange={handleChange}
          style={selectStyle}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="14x14x14">14x14x14</option>
          <option value="16x16x16">16x16x16</option>
          <option value="18x18x18">18x18x18</option>
          <option value="20x20x20">20x20x20</option>
          <option value="18x18x27">18x18x27</option>
          <option value="22x22x22">22x22x22</option>
          <option value="24x24x24">24x24x24</option>
          <option value="24x24x30">24x24x30</option>
          <option value="27x27x27">27x27x27</option>
          <option value="30x30x30">30x30x30</option>
          <option value="28x28x34">28x28x34</option>
          <option value="otro">Otro</option>
        </select>
        {formData.dimensions === "otro" && (
          <input
            type="text"
            name="customDimensions"
            value={formData.customDimensions}
            onChange={handleChange}
            placeholder="Ejemplo: 25x25x25"
            style={{ ...inputStyle, marginTop: "8px" }}
            required
          />
        )}
      </div>
      
      <div style={formFieldStyle}>
        <label style={labelStyle}>Peso (lb):</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Peso en libras"
          style={inputStyle}
          required
        />
      </div>
      
      <div style={formFieldStyle}>
        <label style={labelStyle}>Cantidad:</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Cantidad de paquetes"
          style={inputStyle}
          required
        />
      </div>
      
      <button 
        type="submit" 
        style={buttonStyle}
        onMouseEnter={(e) => e.target.style.backgroundColor = "#45a049"}
        onMouseLeave={(e) => e.target.style.backgroundColor = "#4CAF50"}
      >
        Generar Etiqueta
      </button>
    </form>
  );
};

export default PackageForm;
