export const INFO_TIENDA = {
  nombre: "Grano de Oro Café",
  sucursal: "Sucursal Tec",
  institucion: "Instituto Tecnológico Superior de los Ríos",
  slogan: "Momentos que saben a oro",
  whatsapp: "9341023997",
  empaqueEcologico: true,
  // Para usar el logo en React guarda la imagen en public/assets/logo.png o usa una URL directa
  logoUrl: "/assets/logo-grano-de-oro.png",
  logoTecUrl: "/assets/logo-tec-los-rios.png"
};

export const CATEGORIAS = [
  "Cafés Calientes",
  "Fríos",
  "Jugos y Licuados",
  "Nuevos Platillos",
  "Desayunos Tec"
];

export const PRODUCTOS = [
  // --- CAFÉS CALIENTES (12 oz) ---
  {
    id: 1,
    nombre: "Americano",
    categoria: "Cafés Calientes",
    precio: 35,
    porcion: "12 oz",
    descripcion: "Café espresso recién extraído con agua caliente filtrada.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    nombre: "Capuccino",
    categoria: "Cafés Calientes",
    precio: 50,
    porcion: "12 oz",
    descripcion: "Espresso con leche al vapor y suave capa de espuma densa.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    nombre: "Capuccino Vainilla",
    categoria: "Cafés Calientes",
    precio: 55,
    porcion: "12 oz",
    descripcion: "Espresso con leche vaporizada y jarabe de vainilla artesanal.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    nombre: "Capuccino Moka",
    categoria: "Cafés Calientes",
    precio: 55,
    porcion: "12 oz",
    descripcion: "Combinación de espresso, cacao y leche vaporizada.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    nombre: "Capuccino Irlandes",
    categoria: "Cafés Calientes",
    precio: 55,
    porcion: "12 oz",
    descripcion: "Espresso con toque cremoso estilo crema irlandesa.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80"
  },

  // --- FRÍOS (16 oz) ---
  {
    id: 6,
    nombre: "Frappe Oreo",
    categoria: "Fríos",
    precio: 65,
    porcion: "16 oz",
    descripcion: "Bebida helada de café frappé mezclado con trozos de galleta Oreo y crema.",
    disponible: true,
    alergens: ["Lácteos", "Gluten"],
    imagen: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    nombre: "Frappe Moka",
    categoria: "Fríos",
    precio: 60,
    porcion: "16 oz",
    descripcion: "Blend helado de espresso, jarabe de chocolate y leche con hielo batido.",
    disponible: true,
    alergens: ["Lácteos"],
    imagen: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 8,
    nombre: "Frappe Cajeta",
    categoria: "Fríos",
    precio: 65,
    porcion: "16 oz",
    descripcion: "Café frío licuado con cajeta artesanal y espumoso toque dulzón.",
    disponible: true,
    alergens: ["Lácteos"],
    imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 9,
    nombre: "Latte Frio",
    categoria: "Fríos",
    precio: 60,
    porcion: "16 oz",
    descripcion: "Espresso servido sobre hielo con leche fresca.",
    disponible: true,
    alergens: ["Lácteos"],
    imagen: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 10,
    nombre: "Latte Frio con Oreo",
    categoria: "Fríos",
    precio: 65,
    porcion: "16 oz",
    descripcion: "Latte helado infusionado con galleta Oreo crujiente.",
    disponible: true,
    alergens: ["Lácteos", "Gluten"],
    imagen: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80"
  },

  // --- JUGOS Y LICUADOS (12 oz) ---
  {
    id: 11,
    nombre: "Jugo Verde Tec",
    categoria: "Jugos y Licuados",
    precio: 55,
    porcion: "12 oz",
    descripcion: "Espinaca, manzana verde, pepino, apio y limón fresco.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 12,
    nombre: "Jugo Grano de Oro",
    categoria: "Jugos y Licuados",
    precio: 55,
    porcion: "12 oz",
    descripcion: "Zanahoria, betabel y manzana recién exprimidos.",
    disponible: true,
    imagen: "https://tse4.mm.bing.net/th/id/OIP.iC4RywkiE8wVOyFXDG_K5wHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 13,
    nombre: "Avena con plátano, o fresa, o manzana",
    categoria: "Jugos y Licuados",
    precio: 50,
    porcion: "12 oz",
    descripcion: "Licuado nutritivo con leche, avena, vainilla y fruta a elegir.",
    disponible: true,
    alergens: ["Lácteos", "Avena"],
    imagen: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 14,
    nombre: "Agua del día vaso",
    categoria: "Jugos y Licuados",
    precio: 10,
    descripcion: "Vaso de agua fresca de sabor natural de temporada.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 15,
    nombre: "Piña Colada",
    categoria: "Jugos y Licuados",
    precio: 60,
    descripcion: "Piña, crema de coco y leche batidas.",
    disponible: true,
    alergens: ["Lácteos"],
    imagen: "https://assets.epicurious.com/photos/623e1de1b623bb3c6f80a625/4:3/w_4960,h_3720,c_limit/Not-a-Colada_HERO_RECIPE_032422_30290.jpg"
  },

  // --- NUEVOS PLATILLOS ---
  {
    id: 16,
    nombre: "Enchiladas de Mole",
    categoria: "Nuevos Platillos",
    precio: 70,
    descripcion: "Tortillas de maíz bañadas en mole tradicional con pollo deshebrado, ajonjolí y cebolla morada.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 17,
    nombre: "Omelet de Pollo y Mole",
    categoria: "Nuevos Platillos",
    precio: 60,
    descripcion: "Omelet esponjoso con pollo deshebrado bañado en mole casero, aguacate y cilantro.",
    disponible: true,
    imagen: "https://storage.googleapis.com/ghdz-bucket-donamaria-site-prd/recetas/2024-07-18/180_omelette-de-mole--con-costra-de-papas.webp"
  },
  {
    id: 18,
    nombre: "Enchiladas Suizas",
    categoria: "Nuevos Platillos",
    precio: 70,
    descripcion: "Enchiladas de pollo en salsa verde cremosa gratinadas con queso suizo, crema y cilantro.",
    disponible: true,
    imagen: "https://th.bing.com/th/id/R.5d4f0155b79ac74f68bb8f1941cac694?rik=g%2b1hzP3AYK9fNg&pid=ImgRaw&r=0"
  },
  {
    id: 19,
    nombre: "Sandwich Integral con Pollo",
    categoria: "Nuevos Platillos",
    precio: 40,
    descripcion: "Pechuga de pollo, tomate, lechuga y cebolla en pan integral tostado.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 20,
    nombre: "Brioche 57",
    categoria: "Nuevos Platillos",
    precio: 75,
    descripcion: "Pan brioche suave, ensalada de la casa, lechuga y aguacate.",
    disponible: true,
    imagen: "https://www.giallozafferano.es/images/116-11651/pan-brioche_1200x800.jpg"
  },

  // --- DESAYUNOS TEC ---
  {
    id: 21,
    nombre: "Ensalada César con Pollo",
    categoria: "Desayunos Tec",
    precio: 65,
    descripcion: "Pechuga a la plancha, lechuga orejona, aderezo César, crotones y queso parmesano.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 22,
    nombre: "Chilaquiles Rojos/Verdes",
    categoria: "Desayunos Tec",
    precio: 50,
    descripcion: "Totopos crujientes bañados en salsa verde o roja con crema, queso y cebolla.",
    disponible: true,
    imagen: "https://i.redd.it/44koory6f7991.jpg"
  },
  {
    id: 23,
    nombre: "Omelet",
    categoria: "Desayunos Tec",
    precio: 50,
    descripcion: "Omelet clásico preparado al gusto con vegetales y queso.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 24,
    nombre: "Wrap Zanahoria",
    categoria: "Desayunos Tec",
    precio: 60,
    descripcion: "Tortilla integral rellena de pechuga, zanahoria rallada, lechuga y aderezo especial.",
    disponible: true,
    imagen: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 25,
    nombre: "Hot Cakes Avena",
    categoria: "Desayunos Tec",
    precio: 50,
    descripcion: "Torre de hot cakes esponjosos de avena sin gluten servidos con miel.",
    disponible: false, // Ejemplo para mostrar estado 'Agotado'
    imagen: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80"
  }
];