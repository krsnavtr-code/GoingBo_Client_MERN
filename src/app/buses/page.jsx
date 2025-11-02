'use client';

import FloatingSearchCard from '@/components/FloatingSearchCard';

export default function BusesPage() {

  return (
    <div className="container text-[var(--text-color)] mx-auto px-4 py-8">
      {/* Floating Search Card */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <FloatingSearchCard />
      </div>
    </div>
  );
}
