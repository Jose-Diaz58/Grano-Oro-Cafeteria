import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import Menu from './features/customer/pages/Menu'
const Login = lazy(() => import('./features/admin/pages/Login'))
const Pedidos = lazy(() => import('./features/admin/pages/Pedidos'))
const Catalogo = lazy(() => import('./features/admin/pages/Catalogo'))
const Categorias = lazy(() => import('./features/admin/pages/Categorias'))
const Extras = lazy(() => import('./features/admin/pages/Extras'))
const Configuracion = lazy(() => import('./features/admin/pages/Configuracion'))
const RutaProtegida = lazy(() => import('./features/admin/components/RutaProtegida'))
const Layout = lazy(() => import('./features/admin/components/Layout'))

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{ classNames: { toast: 'font-body border-espresso-500 bg-espresso-700 text-parchment' } }}
      />

      <Suspense fallback={null}>
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
      </Suspense>
    </>
  )
}