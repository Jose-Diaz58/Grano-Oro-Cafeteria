import React, { useState, useEffect } from 'react';
import { INFO_TIENDA } from '../../data/mockData';
import { getProducts } from '../../api/productApi';
import Navbar from '../../components/customer/Navbar';
import HeroBanner from '../../components/customer/HeroBanner';
import CategoriasNav from '../../components/customer/CategoriasNav';
import ProductGrid from '../../components/customer/ProductGrid';
import CartModal from '../../components/customer/modals/CartModal';
import InfoModal from '../../components/customer/modals/InfoModal';
import ProductDetailModal from '../../components/customer/modals/ProductDetailModal';

export default function Menu() {
  const [productosBD, setProductosBD] = useState([]);
  const [categoriasBD, setCategoriasBD] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const productosData = await getProducts();
        setProductosBD(productosData);

        const categoriasUnicas = ['Todas', ...new Set(productosData.map(p => p.categoria))];
        setCategoriasBD(categoriasUnicas);
      } catch (error) {
        console.error('Error al cargar los datos del menú:', error);
      }
    };
    cargarDatos();
  }, []);

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
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans pb-20">
      <Navbar
        cartCount={totalItems}
        onOpenCart={() => setMostrarCarrito(true)}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onOpenInfo={() => setMostrarInfo(true)}
      />
      <HeroBanner info={INFO_TIENDA} />
      <CategoriasNav
        categorias={categoriasBD.filter(c => c !== 'Todas')}
        categoriaActiva={categoriaActiva}
        onSelectCategoria={setCategoriaActiva}
      />
      {busqueda && (
        <div className="max-w-6xl mx-auto px-4 mb-4 text-xs text-stone-500">
          Resultados para: <span className="font-bold text-stone-800">"{busqueda}"</span> ({productosFiltrados.length})
        </div>
      )}
      <ProductGrid
        productos={productosFiltrados}
        onAgregar={agregarAlCarrito}
        onVerDetalle={(producto) => setProductoSeleccionado(producto)}
      />
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