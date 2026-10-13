import React, { useState, useEffect } from 'react';
import { getProducts } from '../../api/productApi';
import { INFO_TIENDA } from '../../data/mockData';
import Navbar from '../../components/customer/Navbar';
import CategoriasNav from '../../components/customer/CategoriasNav';
import ProductGrid from '../../components/customer/ProductGrid';
import CartModal from '../../components/customer/modals/CartModal';
import InfoModal from '../../components/customer/modals/InfoModal';
import ProductDetailModal from '../../components/customer/modals/ProductDetailModal';
import { Package } from 'lucide-react';

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

export default function Menu() {
  const [productosBD, setProductosBD] = useState([]);
  const [categoriasBD, setCategoriasBD] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const productosData = await getProducts();
        setProductosBD(productosData);
        
        const categoriasUnicas = ['Todas', ...new Set(productosData.map(p => p.categoria))];
        setCategoriasBD(categoriasUnicas);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const selectCat = (cat) => {
    if (cat === categoriaActiva) return;
    setLoading(true);
    setCategoriaActiva(cat);
    setTimeout(() => setLoading(false), 400);
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const idProd = producto._id || producto.id;
      const existe = prev.find((item) => (item._id || item.id) === idProd);
      if (existe) {
        return prev.map((item) =>
          (item._id || item.id) === idProd ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const incrementarCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((item) => (item._id || item.id) === id ? { ...item, cantidad: item.cantidad + 1 } : item)
    );
  };

  const decrementarCantidad = (id) => {
    setCarrito((prev) =>
      prev
        .map((item) => (item._id || item.id) === id ? { ...item, cantidad: item.cantidad - 1 } : item)
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => (item._id || item.id) !== id));
  };

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrecio = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const productosFiltrados = productosBD.filter((prod) => {
    const coincideCategoria = categoriaActiva === 'Todas' || prod.categoria === categoriaActiva;
    const coincideBusqueda =
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (prod.descripcion && prod.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    return coincideCategoria && coincideBusqueda;
  });

  const enviarPedidoWhatsApp = ({ nombreCliente, ubicacion, notas }) => {
    if (carrito.length === 0) return;
    let mensaje = `*NUEVO PEDIDO - ${INFO_TIENDA.nombre.toUpperCase()}*\n`;
    mensaje += `*Sucursal:* ${INFO_TIENDA.sucursal}\n`;
    if (nombreCliente) mensaje += `*Cliente:* ${nombreCliente}\n`;
    if (ubicacion) mensaje += `*Ubicación/Mesa:* ${ubicacion}\n`;
    mensaje += `-----------------------------------\n\n`;
    mensaje += `*DETALLE DEL PEDIDO:*\n`;
    carrito.forEach((item) => {
      mensaje += `- ${item.cantidad}x ${item.nombre} - $${item.precio * item.cantidad} MXN\n`;
    });
    mensaje += `\n-----------------------------------\n`;
    mensaje += `*TOTAL: $${totalPrecio} MXN*\n`;
    if (notas) mensaje += `*Notas:* ${notas}\n`;
    mensaje += `*Nota adicional:* Empaque ecológico incluido\n`;
    
    const url = `https://wa.me/52${INFO_TIENDA.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-espresso-900 font-body pb-24">
      <Navbar
        cartCount={totalItems}
        onOpenCart={() => setMostrarCarrito(true)}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onOpenInfo={() => setMostrarInfo(true)}
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
        carrito={carrito}
        totalPrecio={totalPrecio}
        onEnviarPedido={enviarPedidoWhatsApp}
        onIncrementar={incrementarCantidad}
        onDecrementar={decrementarCantidad}
        onEliminar={eliminarDelCarrito}
      />
      <InfoModal
        mostrar={mostrarInfo}
        onCerrar={() => setMostrarInfo(false)}
        info={INFO_TIENDA}
      />
      <ProductDetailModal
        producto={productoSeleccionado}
        onCerrar={() => setProductoSeleccionado(null)}
        onAgregar={agregarAlCarrito}
      />
    </div>
  );
}