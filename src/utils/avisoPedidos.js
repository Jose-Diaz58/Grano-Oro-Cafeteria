import Swal from 'sweetalert2'

// El nombre del cliente lo escribe el cliente: se escapa antes de meterlo en el HTML de la alerta
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

let pendientes = [] // pedidos nuevos que aún no se han atendido desde la alerta abierta

const armarHtml = () => {
  const filas = pendientes
    .map((p) => {
      const mesa = p.mesa && p.mesa !== 'N/A' ? ` · Mesa ${esc(p.mesa)}` : ''
      return `<li style="padding:8px 0;border-bottom:1px solid #e8ddcf">
        <strong>${esc(p.cliente)}</strong> — $${esc(p.total)}<br>
        <small style="color:#796653">${esc(p.tipoServicio)}${mesa} · ${p.items.length} producto(s)</small>
      </li>`
    })
    .join('')
  return `<ul style="list-style:none;margin:0;padding:0;text-align:left;max-height:240px;overflow:auto">${filas}</ul>`
}

const titulo = () => (pendientes.length === 1 ? '¡Nuevo pedido!' : `¡${pendientes.length} pedidos nuevos!`)

// Muestra una alerta SweetAlert que se queda hasta que se cierre. Si llegan más pedidos con la alerta abierta, se agregan a la misma.
export function avisarNuevosPedidos(nuevos, { onVer } = {}) {
  pendientes = [...nuevos, ...pendientes]

  if (Swal.isVisible() && Swal.getPopup()?.dataset.aviso === 'pedidos') {
    Swal.update({ title: titulo(), html: armarHtml() })
    return
  }

  Swal.fire({
    icon: 'info',
    iconColor: '#a8752d',
    title: titulo(),
    html: armarHtml(),
    background: '#fffdf8',
    color: '#21140d',
    confirmButtonText: 'Ver pedidos',
    confirmButtonColor: '#a8752d',
    showCancelButton: true,
    cancelButtonText: 'Cerrar',
    cancelButtonColor: '#796653',
    allowOutsideClick: false,
    didOpen: (popup) => { popup.dataset.aviso = 'pedidos' },
  }).then((r) => {
    pendientes = []
    if (r.isConfirmed) onVer?.()
  })
}
