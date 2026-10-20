// src/data/mockData.js
export const INFO_TIENDA = {
  nombre: "Grano de Oro Café",
  sucursal: "Sucursal Tec",
  institucion: "Instituto Tecnológico Superior de los Ríos",
  slogan: "Momentos que saben a oro",
  whatsapp: "9161095929",
  empaqueEcologico: true,
  logoUrl: "/xd.png",
  logoTecUrl: "/assets/logo-tec-los-rios.png"
};

export const CATEGORIAS = [
  "Cafés Calientes",
  "Fríos",
  "Jugos y Licuados",
  "Nuevos Platillos",
  "Desayunos Tec"
];

export const ESTADOS = ['Nuevo', 'Preparando', 'Listo', 'Entregado'];

export const BADGE = {
  Nuevo: 'bg-amber-100 text-amber-800 border border-amber-300',
  Preparando: 'bg-blue-100 text-blue-800 border border-blue-300',
  Listo: 'bg-green-100 text-green-800 border border-green-300',
  Entregado: 'bg-stone-200 text-stone-600 border border-stone-300',
};

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
};