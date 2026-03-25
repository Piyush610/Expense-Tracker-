export function SkeletonCard() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="skeleton w-11 h-11 rounded-xl" />
        <div className="skeleton w-16 h-6 rounded-full" />
      </div>
      <div>
        <div className="skeleton w-32 h-7 rounded-lg mb-2" />
        <div className="skeleton w-24 h-4 rounded" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="skeleton w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="flex-1">
        <div className="skeleton w-36 h-4 rounded mb-1.5" />
        <div className="skeleton w-24 h-3 rounded" />
      </div>
      <div className="skeleton w-20 h-5 rounded" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="card p-5">
      <div className="skeleton w-40 h-5 rounded mb-6" />
      <div className="skeleton w-full h-48 rounded-xl" />
    </div>
  );
}
