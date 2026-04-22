export function PulsingDot({ color = 'bg-crisis-red', size = 'w-2.5 h-2.5' }) {
  return (
    <span className="relative flex shrink-0">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
      <span className={`relative inline-flex rounded-full ${size} ${color}`} />
    </span>
  );
}
