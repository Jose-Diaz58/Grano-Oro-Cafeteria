export default function ConfirmarEliminar({ titulo, mensaje, onConfirmar, onCancelar, soloAviso = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancelar}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-espresso-500 bg-espresso-700 p-6"
      >
        <h3 className="font-display text-xl font-semibold">{titulo}</h3>
        <p className="mt-2 text-sm text-parchment-muted">{mensaje}</p>
        <div className="mt-6 flex gap-3">
          {soloAviso ? (
            <button onClick={onCancelar} className="h-11 flex-1 rounded-xl bg-gold-500 text-sm font-semibold text-espresso-700 hover:bg-gold-400">
              Entendido
            </button>
          ) : (
            <>
              <button onClick={onCancelar} className="h-11 flex-1 rounded-xl border border-espresso-500 bg-espresso-600 text-sm text-parchment-muted">
                Cancelar
              </button>
              <button onClick={onConfirmar} className="h-11 flex-1 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700">
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}