export function formatTime(stringHours) {
    if (!stringHours) {
      return "Invalid Time";
    }

    const date = new Date(stringHours);
    if (isNaN(date.getTime())) {
      return "Invalid Time"; // Evita errores con fechas inválidas
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12; // Convierte 0 en 12 para 12 AM
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}${ampm}`;
  }