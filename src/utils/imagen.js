// Imágenes de productos: se redimensionan y comprimen en el navegador antes de guardarse,
// para que la base de datos no se llene de fotos pesadas.
export const ENTRADA_MAX_MB = 8        // tamaño máximo del archivo que se puede elegir
export const SALIDA_MAX_KB = 150       // tamaño máximo que se guarda ya comprimida
const LADO_MAX = 800                   // px del lado más largo
const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const bytesDeDataUrl = (url) => Math.round(((url.length - url.indexOf(',') - 1) * 3) / 4)

const abrirImagen = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen')) }
    img.src = url
  })

// Devuelve un data URL JPEG de máximo SALIDA_MAX_KB. Lanza Error con un mensaje listo para mostrar.
export async function comprimirImagen(file) {
  if (!TIPOS.includes(file.type)) throw new Error('Formato no válido. Usa JPG, PNG, WebP o GIF')
  if (file.size > ENTRADA_MAX_MB * 1024 * 1024) throw new Error(`La imagen pesa más de ${ENTRADA_MAX_MB} MB`)

  const img = await abrirImagen(file)
  let escala = Math.min(1, LADO_MAX / Math.max(img.width, img.height))

  for (let intento = 0; intento < 6; intento++) {
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(img.width * escala))
    canvas.height = Math.max(1, Math.round(img.height * escala))
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff' // el JPEG no tiene transparencia
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    for (let calidad = 0.82; calidad >= 0.5; calidad -= 0.08) {
      const resultado = canvas.toDataURL('image/jpeg', calidad)
      if (bytesDeDataUrl(resultado) <= SALIDA_MAX_KB * 1024) return resultado
    }
    escala *= 0.8 // sigue pesando mucho: se reduce el tamaño y se reintenta
  }
  throw new Error('No se pudo reducir lo suficiente la imagen. Prueba con otra')
}

export const esDataUrl = (valor) => typeof valor === 'string' && valor.startsWith('data:image/')
export const esUrlHttp = (valor) => /^https?:\/\/\S+$/i.test(valor || '')