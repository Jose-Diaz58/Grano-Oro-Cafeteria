import logoTienda from '../assets/xd.webp'

export const SPLASH_MS = 1700       // login del admin
export const SPLASH_MENU_MS = 700   // pantalla de bienvenida del menú público (mínimo)
export const ESQUELETO_MIN_MS = 1500
export const CATEGORIA_TODAS = 'Todas'

export const CATEGORIAS_BASE = ['Cafés Calientes', 'Fríos', 'Jugos y Licuados', 'Nuevos Platillos', 'Desayunos Tec']

export const ESTADOS = ['Nuevo', 'Preparando', 'Listo', 'Entregado']

export const BADGE = {
  Nuevo: 'bg-amber-100 text-amber-800 border border-amber-300',
  Preparando: 'bg-blue-100 text-blue-800 border border-blue-300',
  Listo: 'bg-green-100 text-green-800 border border-green-300',
  Entregado: 'bg-stone-200 text-stone-600 border border-stone-300',
}

export const CONFIG_INICIAL = {
  nombre: 'Grano de Oro Café',
  sucursal: 'Sucursal Tec',
  ubicacion: 'Instituto Tecnológico Superior de los Ríos',
  eslogan: 'Momentos que saben a oro',
  whatsapp: '9161095929',
  dias: 'Lunes a Viernes',
  apertura: '07:00',
  cierre: '17:00',
  ecologico: true,
  minutosPrep: 12,
  pausado: false,
}

export const INFO_TIENDA = {
  nombre: CONFIG_INICIAL.nombre,
  sucursal: CONFIG_INICIAL.sucursal,
  institucion: CONFIG_INICIAL.ubicacion,
  slogan: CONFIG_INICIAL.eslogan,
  whatsapp: CONFIG_INICIAL.whatsapp,
  empaqueEcologico: CONFIG_INICIAL.ecologico,
  logoUrl: logoTienda,
}