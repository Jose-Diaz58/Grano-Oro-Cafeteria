import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// --- Vistas del Cliente ---
import Menu from './pages/Customer/Menu.jsx';

// --- Vistas del Administrador ---
import Login from './pages/admin/Login.jsx';
import Pedidos from './pages/admin/Pedidos.jsx';
import Catalogo from './pages/admin/Catalogo.jsx';
import Categorias from './pages/admin/Categorias.jsx';
import Extras from './pages/admin/Extras.jsx';
import Configuracion from './pages/admin/Configuracion.jsx';

// --- Componentes del Administrador ---
import RutaProtegida from './components/admin/RutaProtegida.jsx';
import Layout from './components/admin/Layout.jsx';

export default function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        richColors 
        closeButton 
        toastOptions={{ classNames: { toast: 'font-body border-espresso-500 bg-espresso-700 text-parchment' } }} 
      />

      <Routes>
        {/* =========================================
            ZONA PÚBLICA (CLIENTE)
        ========================================= */}
        <Route path="/" element={<Menu />} />

        {/* =========================================
            ZONA DE ADMINISTRACIÓN
        ========================================= */}
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<RutaProtegida />}>
          <Route element={<Layout />}>
            {/* Redirigir /admin automáticamente a /admin/pedidos */}
            <Route index element={<Navigate to="pedidos" replace />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="extras" element={<Extras />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Route>

        {/* =========================================
            RUTA POR DEFECTO (Si no existe la URL, vuelve al Menú)
        ========================================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}