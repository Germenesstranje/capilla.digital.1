import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const run = async () => {
      // Generate or retrieve session id
      let sid = localStorage.getItem('chapel_sid');
      if (!sid) {
        sid = Math.random().toString(36).slice(2) + Date.now();
        localStorage.setItem('chapel_sid', sid);
        // Register new visit
        await base44.entities.Visitor.create({ session_id: sid });
      }
      // Count total visitors
      const all = await base44.entities.Visitor.list();
      setCount(all.length);
    };
    run();
  }, []);

  if (count === null) return null;

  return (
    <div className="absolute top-3 left-3 z-20 bg-amber-900/80 backdrop-blur-sm text-amber-100 font-body text-xs px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
      <span>⛪</span>
      <span>Peregrinos: <strong>{count}</strong></span>
    </div>
  );
}
