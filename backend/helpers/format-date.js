const formatDate = (date) => {
    if (!(date instanceof Date)) {
      throw new Error("O valor fornecido não é uma instância de Date.");
    }
    // Obtendo partes da data
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Formatando a data
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  
  
  module.exports = formatDate