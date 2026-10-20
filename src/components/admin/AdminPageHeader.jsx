import React from 'react'

export default function AdminPageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-7 sm:flex-row sm:gap-6">
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-500">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl font-semibold text-parchment sm:text-3xl">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-parchment-muted">
          {description}
        </p>
      </div>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  )
}