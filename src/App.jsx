import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import Menu from './features/customer/pages/Menu'
import Login from './features/admin/pages/Login'
import Pedidos from './features/admin/pages/Pedidos'
import Catalogo from './features/admin/pages/Catalogo'
import Categorias from './features/admin/pages/Categorias'
import Extras from './features/admin/pages/Extras'
import Configuracion from './features/admin/pages/Configuracion'
import RutaProtegida from './features/admin/components/RutaProtegida'
import Layout from './features/admin/components/Layout'

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
        <Route path="/" element={<Menu />} />

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<RutaProtegida />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="pedidos" replace />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="extras" element={<Extras />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
