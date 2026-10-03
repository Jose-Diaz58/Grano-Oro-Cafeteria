import React from 'react';

export default function HeroBanner({ info }) {
  return (
    <section className="bg-stone-900 text-stone-100 py-8 px-4 text-center border-b-4 border-amber-500">
      <h2 className="text-2xl font-serif font-bold text-amber-400">{info.nombre}</h2>
      <p className="text-sm font-medium mt-1">{info.sucursal} • {info.institucion}</p>
      <p className="text-xs text-stone-400 italic mt-2">"{info.slogan}"</p>
    </section>
  );
}