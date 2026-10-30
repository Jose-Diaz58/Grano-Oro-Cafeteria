import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, User } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { SPLASH_MS } from '../../../config/constants'
import logo from '../../../assets/Logo-sin-fondo.png'
import SplashScreen from '../../customer/components/SplashScreen'

const campo = 'w-full bg-espresso-800 border border-espresso-600 rounded-xl py-3 pl-10 pr-4 text-sm text-parchment placeholder-parchment-muted focus:outline-none focus:border-gold-500 transition-colors'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [entrando, setEntrando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // TEMPORAL: login de prueba. Se reemplaza por la API real más adelante.
    if (usuario === 'admin' && password === '1234') {
      setEntrando(true)
      login('token-de-prueba')
      setTimeout(() => navigate('/admin/pedidos'), SPLASH_MS)
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-espresso-900 p-4 font-body relative overflow-hidden">
      <SplashScreen mostrar={entrando} />

      {!entrando && (
        <div className="w-full max-w-sm bg-espresso-700 border border-espresso-500 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-espresso-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img src={logo} alt="Grano de Oro" className="h-16 w-auto object-contain opacity-90 drop-shadow-md" />
              </div>
              <h1 className="text-2xl font-display font-bold text-parchment tracking-wide">Grano de Oro</h1>
              <p className="text-[10px] text-gold-500 uppercase tracking-[0.2em] mt-1.5 font-semibold">Panel de Administración</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-parchment-muted" />
                <input className={campo} placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-parchment-muted" />
                <input
                  type="password"
                  className={campo}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-center">
                <p className="text-xs text-red-400 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gold-500 text-espresso-950 rounded-xl py-3.5 text-sm font-bold tracking-wide hover:bg-gold-400 transition-all active:scale-95 shadow-[0_0_15px_rgba(168,117,45,0.2)] mt-2"
            >
              Entrar al sistema
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
