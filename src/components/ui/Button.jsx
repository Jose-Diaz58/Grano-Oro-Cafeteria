import React from 'react';

export default function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  const baseStyle = "w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md";
  const variants = {
    primary: "bg-stone-950 hover:bg-stone-800 text-white",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer",
    disabled: "bg-stone-200 text-stone-400 cursor-not-allowed",
    outline: "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
  };

  const currentVariant = disabled ? variants.disabled : variants[variant];

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${currentVariant} ${className}`}
    >
      {children}
    </button>
  );
}