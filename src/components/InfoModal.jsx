import React from 'react';

export default function InfoModal({ mostrar, onCerrar, info }) {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-stone-200">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">ℹ️</span>
            <h3 className="text-base font-bold font-serif text-stone-900">
              Información del Negocio
            </h3>
          </div>
          <button
            onClick={onCerrar}
            className="text-stone-400 hover:text-stone-600 font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs text-stone-700">
          <div>
            <p className="font-bold text-stone-900 text-sm">{info.nombre}</p>
            <p className="text-amber-700 font-medium">{info.sucursal}</p>
            <p className="text-stone-500">{info.institucion}</p>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
            <p className="italic text-stone-600 text-center">"{info.slogan}"</p>
          </div>

          <div className="pt-2 border-t space-y-1">
            <p><strong>📱 WhatsApp:</strong> +52 {info.whatsapp}</p>
            <p><strong>🕒 Horario:</strong> Lunes a Viernes (7:00 AM - 5:00 PM)</p>
            <p><strong>🌿 Compromiso:</strong> Empaque ecológico incluido en todos los pedidos.</p>
          </div>
        </div>

        <button
          onClick={onCerrar}
          className="w-full mt-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold rounded-xl text-xs transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}