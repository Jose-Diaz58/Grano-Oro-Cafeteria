import { useState, useEffect } from 'react';
import { getProducts, getExtras, getConfig, getCategories } from '../../api.js';
import { INFO_TIENDA } from '../../data/mockData';
import Navbar from '../../components/customer/Navbar';
import CategoriasNav from '../../components/customer/CategoriasNav';
import ProductGrid from '../../components/customer/ProductGrid';
import CartModal from '../../components/customer/modals/CartModal';
import InfoModal from '../../components/customer/modals/InfoModal';
import ProductDetailModal from '../../components/customer/modals/ProductDetailModal';
import { Package } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import SplashScreen from '../../components/customer/SplashScreen';

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-espresso-700 border border-espresso-500">
      <div className="h-44 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded-lg skeleton" />
        <div className="h-4 w-1/3 rounded-lg skeleton" />
        <div className="h-12 rounded-xl skeleton mt-2" />
      </div>
    </div>
  );
}

const formatearHora = (hhmm = '') => {
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h)) return hhmm;
  return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

// --- LÓGICA CENTRALIZADA DE HORARIOS ---
const verificarDisponibilidad = (config) => {
  if (!config) return { abierto: true }; 
  
  // 1. Pausa de emergencia
  if (config.pausado) {
    return { abierto: false, motivo: 'Por el momento no estamos recibiendo pedidos por alta demanda.' };
  }

  // 2. Reloj ajustado a México
  const ahora = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
  const fechaActual = new Date(ahora);
  const diaSemana = fechaActual.getDay(); // 0 = Domingo

  // 3. Validación del Día
  let abiertoHoy = false;
  const diasConfig = (config.dias || '').toLowerCase();

  if (diasConfig.includes('lunes a viernes')) {
    abiertoHoy = diaSemana >= 1 && diaSemana <= 5;
  } else if (diasConfig.includes('sábado') || diasConfig.includes('sabado')) {
    abiertoHoy = diaSemana >= 1 && diaSemana <= 6;
  } else if (diasConfig.includes('todos')) {
    abiertoHoy = true;
  }

  if (!abiertoHoy) return { abierto: false, motivo: `Día de descanso. Abrimos de ${config.dias}.` };

  // 4. Validación Matemática de la Hora
  const horaActualNum = fechaActual.getHours() * 100 + fechaActual.getMinutes();
  
  const [horaApe, minApe] = (config.apertura || '07:00').split(':').map(Number);
  const aperturaNum = horaApe * 100 + minApe;

  const [horaCie, minCie] = (config.cierre || '17:00').split(':').map(Number);
  const cierreNum = horaCie * 100 + minCie;

  // Soporta horarios normales y de trasnochador (ej. cierra a las 2:00 AM)
  const overnight = aperturaNum > cierreNum;
  const dentroDeHorario = overnight 
    ? (horaActualNum >= aperturaNum || horaActualNum <= cierreNum)
    : (horaActualNum >= aperturaNum && horaActualNum <= cierreNum);

  if (dentroDeHorario) {
    return { abierto: true };
  } else {
    const horaCierreFormat = `${horaCie % 12 || 12}:${String(minCie).padStart(2, '0')} ${horaCie < 12 ? 'AM' : 'PM'}`;
    return { abierto: false, motivo: `Fuera de horario (Cerramos a las ${horaCierreFormat}).` };
  }
};

export default function Menu() {
  const [config, setConfig] = useState(null); 
  const [productosBD, setProductosBD] = useState([]);
  const [categoriasBD, setCategoriasBD] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  const { carrito, agregarAlCarrito } = useCartStore();
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  // Analizamos si la tienda está abierta antes de renderizar
  const estadoTienda = verificarDisponibilidad(config);
  const tiendaCerrada = !estadoTienda.abierto;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const tiempoMinimo = new Promise(resolve => setTimeout(resolve, 1700));

        const extrasPromesa = getExtras().catch(() => []);
        const configPromesa = getConfig().then(setConfig).catch(() => {});
        const categoriasPromesa = getCategories().catch(() => []);

        const peticionAPI = Promise.all([
          getProducts(), 
          extrasPromesa, 
          categoriasPromesa
        ]).then(([productosData, extrasData, categoriasData]) => {
          
          setProductosBD(productosData.map((prod) => ({
            ...prod,
            extras: extrasData.filter((ex) => (ex.productos || []).includes(prod._id)),
          })));

          const nombresOrdenados = categoriasData
            .filter(cat => cat.visible !== false)
            .map(cat => cat.nombre);
            
          setCategoriasBD(['Todas', ...nombresOrdenados]);
        });

        await Promise.all([tiempoMinimo, peticionAPI, configPromesa]);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setShowSplash(false); 
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  const info = {
    ...INFO_TIENDA,
    ...(config && {
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
    }),
    estadoTienda // Inyectamos el estado a los modales
  };

  const selectCat = (cat) => {
    if (cat === categoriaActiva) return;
    setLoading(true);
    setCategoriaActiva(cat);
    setTimeout(() => setLoading(false), 400);
  };

  // Interceptor: Bloquea añadir productos si está cerrado
  const handleAgregarSeguro = (producto, variante, extras) => {
    if (tiendaCerrada) {
      alert(`Lo sentimos. ${estadoTienda.motivo}`);
      return;
    }
    agregarAlCarrito(producto, variante, extras);
  };

  const productosFiltrados = productosBD.filter((prod) => {
    const coincideCategoria = categoriaActiva === 'Todas' || prod.categoria === categoriaActiva;
    const coincideBusqueda =
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (prod.descripcion && prod.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-espresso-900 font-body pb-24">
      <SplashScreen mostrar={showSplash} />

      <Navbar
        cartCount={totalItems}
        onOpenCart={() => setMostrarCarrito(true)}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onOpenInfo={() => setMostrarInfo(true)}
        nombre={info.nombre}
      />
      <CategoriasNav
        categorias={categoriasBD.filter(c => c !== 'Todas')}
        categoriaActiva={categoriaActiva}
        onSelectCategoria={selectCat}
      />
      
      <main className="mx-auto max-w-6xl px-4 pt-6">
        
        {/* BANNER DE TIENDA CERRADA O FUERA DE HORARIO */}
        {tiendaCerrada && (
          <div className="mb-6 rounded-2xl bg-red-950/40 border border-red-500/50 p-4 text-center shadow-lg">
            <h3 className="text-red-400 font-display text-lg font-bold">Cerrado temporalmente</h3>
            <p className="text-red-300/80 text-sm mt-1">{estadoTienda.motivo}</p>
          </div>
        )}

        {busqueda && (
          <div className="mb-4 text-xs text-parchment-muted">
            Resultados para: <span className="font-bold text-parchment">"{busqueda}"</span> ({productosFiltrados.length})
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center text-center">
            <Package className="mb-4 h-14 w-14 text-parchment-muted opacity-40" strokeWidth={1.3} />
            <h2 className="font-display text-xl font-semibold text-parchment">Nada por aquí todavía</h2>
            <p className="mt-2 max-w-xs text-sm text-parchment-muted">No se encontraron productos en esta categoría.</p>
          </div>
        ) : (
          <ProductGrid
            productos={productosFiltrados}
            onAgregar={handleAgregarSeguro}
            onVerDetalle={(producto) => setProductoSeleccionado(producto)}
          />
        )}
      </main>

      <CartModal
        mostrar={mostrarCarrito}
        onCerrar={() => setMostrarCarrito(false)}
        info={info}
      />
      
      <InfoModal
        mostrar={mostrarInfo}
        onCerrar={() => setMostrarInfo(false)}
        info={info}
      />
      <ProductDetailModal
        producto={productoSeleccionado}
        onCerrar={() => setProductoSeleccionado(null)}
        onAgregar={handleAgregarSeguro}
      />
    </div>
  );
}