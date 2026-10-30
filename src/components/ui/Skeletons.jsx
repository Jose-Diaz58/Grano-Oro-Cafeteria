export function Skeleton({ className = '' }) {
  return <div className={`relative overflow-hidden rounded-xl bg-espresso-700/80 skeleton ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-espresso-500/60 bg-espresso-700/80 p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
      </div>
      <div className="mt-4 flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-espresso-500/60 bg-espresso-700/80 p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <Skeleton className="h-3 w-1/3 rounded-md" />
      </div>
      <Skeleton className="h-7 w-16 rounded-full" />
    </div>
  )
}

export function SkeletonForm() {
  return (
    <div className="space-y-6 rounded-2xl border border-espresso-500/60 bg-espresso-700/80 p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-6 w-48 rounded-lg" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonProducto() {
  return (
    <div className="overflow-hidden rounded-2xl border border-espresso-500 bg-espresso-700">
      <div className="h-44 skeleton" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded-lg skeleton" />
        <div className="h-4 w-1/3 rounded-lg skeleton" />
        <div className="mt-2 h-12 rounded-xl skeleton" />
      </div>
    </div>
  )
}
