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
    quantity: "", // Nuevo campo para cantidad
  });

  const API_URL = "https://administracion-etiquetas.onrender.com/api/packages";

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
        ? data.customCity.slice(0, 3).toUpperCase() // Primeras 3 letras de la ciudad personalizada
        : data.city.slice(0, 3).toUpperCase(); // Primeras 3 letras de la ciudad seleccionada
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 caracteres aleatorios

    return `${clientPrefix}-${cityPrefix}-${timestamp}-${randomString}`;
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica de campos
    if (
      formData.sender &&
      formData.street &&
      formData.postalCode &&
      (formData.city !== "otro" || formData.customCity) &&
      (formData.dimensions !== "otro" || formData.customDimensions) &&
      formData.weight &&
      formData.quantity
    ) {
      // Generar el código único
      const uniqueCode = generateUniqueCode(formData);

      // Construir los datos del paquete
      const packageData = {
        paquete_id: uniqueCode, // Asignar uniqueCode al paquete_id
        uniqueCode, // También enviarlo como uniqueCode
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

      // Guardar el paquete en la base de datos
      try {
        const response = await axios.post(API_URL, packageData);
        console.log("Paquete guardado en la base de datos:", response.data);
      } catch (error) {
        console.error("Error al guardar el paquete:", error);
        alert("Hubo un error al intentar guardar el paquete.");
      }
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <div>
        <label>
          Remitente:
          <input
            type="text"
            name="sender"
            value={formData.sender}
            onChange={handleChange}
            placeholder="Nombre del remitente"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Calle y número:
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Calle y número"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Código postal:
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Código postal"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Ciudad:
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="Jalisco">Jalisco</option>
            <option value="Michoacán">Michoacán</option>
            <option value="Guanajuato">Guanajuato</option>
            <option value="otro">Otro</option>
          </select>
        </label>
        {formData.city === "otro" && (
          <input
            type="text"
            name="customCity"
            value={formData.customCity}
            onChange={handleChange}
            placeholder="Especifica la ciudad"
            style={{ marginTop: "5px" }}
            required
          />
        )}
      </div>
      <div>
        <label>
          Dimensiones (LxWxH en pulgadas):
          <select
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
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
            <option value="otro">Otro</option>
          </select>
        </label>
        {formData.dimensions === "otro" && (
          <input
            type="text"
            name="customDimensions"
            value={formData.customDimensions}
            onChange={handleChange}
            placeholder="Ejemplo: 25x25x25"
            style={{ marginTop: "5px" }}
            required
          />
        )}
      </div>
      <div>
        <label>
          Peso (lb):
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Peso en libras"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Cantidad:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Cantidad de paquetes"
            required
          />
        </label>
      </div>
      <button type="submit" style={{ marginTop: "10px" }}>
        Generar Etiqueta
      </button>
    </form>
  );
};

export default PackageForm;
