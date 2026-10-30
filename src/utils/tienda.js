import { CONFIG_INICIAL, INFO_TIENDA } from '../config/constants'

const ZONA_HORARIA = 'America/Mexico_City'

export function formatearHora(hhmm = '') {
  const [h, m] = hhmm.split(':').map(Number)
  if (Number.isNaN(h)) return hhmm
  return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

export function formatearHoraLocal(hhmm) {
  if (!hhmm) return ''
  const [h = 0, m = 0] = hhmm.split(':').map(Number)
  return new Intl.DateTimeFormat('es-MX', { hour: 'numeric', minute: '2-digit' }).format(new Date(2025, 0, 1, h, m))
}

export function estimarPreparacion(minutosPrep) {
  const desde = Math.max(10, minutosPrep * 2 + 1)
  return [desde, desde + 5]
}

const aHHMM = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 100 + m
}

const abreHoy = (dias, diaSemana) => {
  const texto = (dias || '').toLowerCase()
  if (texto.includes('lunes a viernes')) return diaSemana >= 1 && diaSemana <= 5
  if (texto.includes('sábado') || texto.includes('sabado')) return diaSemana >= 1 && diaSemana <= 6
  return texto.includes('todos')
}

export function verificarDisponibilidad(config) {
  if (!config) return { abierto: true }

  if (config.pausado) {
    return {
      abierto: false,
      motivo: 'Por el momento no estamos recibiendo pedidos por alta demanda.',
      proximaApertura: 'En unos Minutos....',
    }
  }

  const apertura = config.apertura || CONFIG_INICIAL.apertura
  const cierre = config.cierre || CONFIG_INICIAL.cierre
  const horaApertura = formatearHora(apertura)
  const ahora = new Date(new Date().toLocaleString('en-US', { timeZone: ZONA_HORARIA }))

  if (!abreHoy(config.dias, ahora.getDay())) {
    return {
      abierto: false,
      motivo: `Día de descanso. Abrimos de ${config.dias}.`,
      proximaApertura: `${config.dias?.split(' ')[0] || 'Próximamente'} a las ${horaApertura}`,
    }
  }

  const actual = ahora.getHours() * 100 + ahora.getMinutes()
  const desde = aHHMM(apertura)
  const hasta = aHHMM(cierre)
  const dentroDeHorario = desde > hasta ? actual >= desde || actual <= hasta : actual >= desde && actual <= hasta

  if (dentroDeHorario) return { abierto: true }

  return {
    abierto: false,
    motivo: `Fuera de horario (Cerramos a las ${formatearHora(cierre)}).`,
    proximaApertura: `Mañana a las ${horaApertura}`,
  }
}

// Adapta la configuración del API al formato que usan los modales del cliente
export function infoDeConfig(config) {
  if (!config) return INFO_TIENDA
  return {
    ...INFO_TIENDA,
    nombre: config.nombre,
    sucursal: config.sucursal,
    institucion: config.ubicacion,
    slogan: config.eslogan,
    whatsapp: config.whatsapp,
    dias: config.dias,
    apertura: config.apertura,
    cierre: config.cierre,
    horario: `${formatearHora(config.apertura)} - ${formatearHora(config.cierre)}`,
    empaqueEcologico: config.ecologico,
    minutosPrep: config.minutosPrep,
    pausado: config.pausado,
  }
}
