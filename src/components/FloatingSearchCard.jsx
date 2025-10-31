'use client';

import React from 'react';
import { Plane, Hotel, Car, Bus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FloatingSearchCard = () => {
  const pathname = usePathname();
  
  const tabs = [
    { id: 'flight', label: 'Flights', icon: <Plane className="w-5 h-5" />, path: '/flights' },
    { id: 'hotel', label: 'Hotels', icon: <Hotel className="w-5 h-5" />, path: '/hotels' },
    { id: 'cab', label: 'Cabs', icon: <Car className="w-5 h-5" />, path: '/cabs' },
    { id: 'bus', label: 'Buses', icon: <Bus className="w-5 h-5" />, path: '/buses' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="bg-[var(--container-color-in)] rounded shadow-xl px-5 py-2 w-full max-w-4xl mx-auto -mt-16 relative z-10">
      <div className="flex gap-2 justify-center">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.path}
            className={`flex items-center gap-1 px-3 py-1 font-medium rounded-lg transition-colors ${
              isActive(tab.path) 
                ? 'bg-[var(--logo-color-two)] text-white' 
                : 'bg-[var(--logo-color)] text-white hover:bg-[var(--logo-color-two)]'
            }`}
          >
            <div className="flex items-center flex-col gap-1">
              {tab.icon}
              <span className="text-xs">{tab.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FloatingSearchCard;
