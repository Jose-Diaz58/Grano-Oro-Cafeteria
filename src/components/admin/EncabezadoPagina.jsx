export default function EncabezadoPagina({ eyebrow, titulo, descripcion, accion }) {
  return (
    <div className="mb-7 flex items-start justify-between gap-6">
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-500">{eyebrow}</p>
        <h2 className="font-display text-3xl font-semibold">{titulo}</h2>
        <p className="mt-1 max-w-2xl text-sm text-parchment-muted">{descripcion}</p>
      </div>
      {accion}
    </div>
  )
}
