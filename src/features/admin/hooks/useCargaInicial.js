import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { ESQUELETO_MIN_MS } from '../../../config/constants'

// Carga datos una sola vez al montar la página y mantiene `cargando` en true al menos
// ESQUELETO_MIN_MS para que se alcance a ver el esqueleto.
// alRecibir(datos) se llama con el resultado de cargar(); alFallar(error) con el error (por defecto, un toast).
export function useCargaInicial(cargar, alRecibir, alFallar = (e) => toast.error(e.message)) {
  const [cargando, setCargando] = useState(true)
  const ultimos = useRef({ cargar, alRecibir, alFallar })
  useEffect(() => { ultimos.current = { cargar, alRecibir, alFallar } })

  useEffect(() => {
    let activo = true
    const espera = new Promise((resolve) => setTimeout(resolve, ESQUELETO_MIN_MS))

    Promise.all([ultimos.current.cargar(), espera])
      .then(([datos]) => activo && ultimos.current.alRecibir(datos))
      .catch((e) => activo && ultimos.current.alFallar(e))
      .finally(() => activo && setCargando(false))

    return () => { activo = false }
  }, [])

  return cargando
}
