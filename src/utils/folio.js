const CLAVE = 'grano-de-oro-ultimo-folio'
const hoy = () => new Date().toLocaleDateString('en-CA') // AAAA-MM-DD en hora local

export const formatearFolio = (n) => `#${String(n).padStart(3, '0')}`

// Acepta "12", "#12" o "#012"
export const leerFolio = (texto) => {
  const n = parseInt(String(texto).replace(/\D/g, ''), 10)
  return Number.isInteger(n) && n > 0 ? n : null
}

// El folio solo vale el día del pedido, así que se guarda con la fecha de hoy
export const guardarUltimoFolio = (folio) => {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ folio, dia: hoy() }))
  } catch {
    /* sin almacenamiento disponible */
  }
}

export const leerUltimoFolio = () => {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE))
    return guardado?.dia === hoy() ? guardado.folio : null
  } catch {
    return null
  }
}