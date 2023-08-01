export function convertCamelCase(str) {
    // Agrega un espacio antes de cada letra mayúscula y luego convierte todo a minúsculas
    const result = str.replace(/([A-Z])/g, " $1").toLowerCase();
  
    // Convierte la primera letra en mayúscula
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
  