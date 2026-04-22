import { useEffect, useState } from 'react';

export function AnimatedCounter({ value, className }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const step = value > display ? 1 : -1;
    if (display === value) return;
    const t = setTimeout(() => setDisplay(d => d + step), 30);
    return () => clearTimeout(t);
  }, [value, display]);

  return <span className={className}>{display}</span>;
}
