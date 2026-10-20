import { useState, useEffect } from 'react';
import { getProducts, getExtras, getConfig } from '../../api.js';
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

// "07:00" -> "7:00 AM"
const formatearHora = (hhmm = '') => {
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h)) return hhmm;
  return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

export default function Menu() {
  const [config, setConfig] = useState(null); // configuración del admin (null = sin cargar)
  const [productosBD, setProductosBD] = useState([]);
  const [categoriasBD, setCategoriasBD] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  // Zustand para estado global del carrito
  const { carrito, agregarAlCarrito } = useCartStore();
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        // 1. Promesa 1: Temporizador estricto de 1000ms (1 segundo)
        const tiempoMinimo = new Promise(resolve => setTimeout(resolve, 1700));

        // 2. Promesa 2: Tu llamada real a la base de datos
        // Extras y configuración del admin: si fallan, el menú sigue funcionando sin ellos
        const extrasPromesa = getExtras().catch(() => []);
        const configPromesa = getConfig().then(setConfig).catch(() => {});

        const peticionAPI = Promise.all([getProducts(), extrasPromesa]).then(([productosData, extrasData]) => {
          // A cada producto le colgamos los extras globales que el admin le asignó
          setProductosBD(productosData.map((prod) => ({
            ...prod,
            extras: extrasData.filter((ex) => (ex.productos || []).includes(prod._id)),
          })));
          const categoriasUnicas = ['Todas', ...new Set(productosData.map(p => p.categoria))];
          setCategoriasBD(categoriasUnicas);
        });

        // 3. Ejecutar ambas al mismo tiempo y esperar a que la MÁS LENTA termine
        await Promise.all([tiempoMinimo, peticionAPI, configPromesa]);

      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        // Cuando pasan los 2 segundos Y los datos ya cargaron, quitamos la pantalla
        setShowSplash(false); 
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  // Datos de la tienda: lo que guardó el admin; si no hay servidor, los valores de respaldo
  const info = {
    ...INFO_TIENDA,
    ...(config && {
      nombre: config.nombre,
      sucursal: config.sucursal,
      institucion: config.ubicacion,
      slogan: config.eslogan,
      whatsapp: config.whatsapp,
      dias: config.dias,
      horario: `${formatearHora(config.apertura)} - ${formatearHora(config.cierre)}`,
      empaqueEcologico: config.ecologico,
      minutosPrep: config.minutosPrep,
      pausado: config.pausado,
    }),
  };

  const selectCat = (cat) => {
    if (cat === categoriaActiva) return;
    setLoading(true);
    setCategoriaActiva(cat);
    setTimeout(() => setLoading(false), 400);
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
            onAgregar={agregarAlCarrito}
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
        onAgregar={agregarAlCarrito}
      />
    </div>
  );
}