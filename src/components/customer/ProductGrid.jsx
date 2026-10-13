import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ productos, onAgregar, onVerDetalle }) {
  return (
    <main className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productos.map((prod, index) => (
          <ProductCard
            key={prod._id || prod.id || index}
            producto={prod}
            onAgregar={onAgregar}
            onVerDetalle={onVerDetalle}
          />
        ))}
      </div>
    </main>
  );
}