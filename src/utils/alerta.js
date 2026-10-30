let ctx

// Aviso sonoro de "nuevo pedido" generado con Web Audio (no necesita archivos de audio)
export function sonarAlerta() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ctx = ctx || new AC()
    if (ctx.state === 'suspended') ctx.resume()

    const tono = (frecuencia, inicio, duracion) => {
      const osc = ctx.createOscillator()
      const vol = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = frecuencia
      vol.gain.setValueAtTime(0.0001, ctx.currentTime + inicio)
      vol.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + inicio + 0.02)
      vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + inicio + duracion)
      osc.connect(vol).connect(ctx.destination)
      osc.start(ctx.currentTime + inicio)
      osc.stop(ctx.currentTime + inicio + duracion)
    }
    tono(880, 0, 0.25)
    tono(1175, 0.25, 0.35)
  } catch {
    // Sin audio (o bloqueado por el navegador hasta el primer clic): el aviso visual sigue funcionando
  }
}
