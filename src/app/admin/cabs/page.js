'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

// Components (simple placeholders)
import CabList from './components/CabList';
import CabBookings from './components/CabBookings';
import CabStats from './components/CabStats';
import CabDrivers from './components/CabDrivers';
import CabSettings from './components/CabSettings';

export default function CabsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('cabs');

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6 text-[var(--text-color)]">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Cab Management</h1>
            </div>

            {/* Tabs */}
            <div>
                <div className="flex flex-wrap gap-3 border-b pb-2">
                    {[
                        { id: 'cabs', label: 'Cabs' },
                        { id: 'bookings', label: 'Bookings' },
                        { id: 'drivers', label: 'Drivers' },
                        { id: 'stats', label: 'Statistics' },
                        { id: 'settings', label: 'Settings' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-t-md transition cursor-pointer ${activeTab === tab.id
                                    ? 'bg-[var(--logo-color-two)]'
                                    : 'bg-[var(--logo-color)] hover:bg-[var(--logo-color-two)]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="mt-4 p-4 border rounded-md bg-[var(--container-color-in)] shadow-sm">
                    {activeTab === 'cabs' && <CabList />}
                    {activeTab === 'bookings' && <CabBookings />}
                    {activeTab === 'drivers' && <CabDrivers />}
                    {activeTab === 'stats' && <CabStats />}
                    {activeTab === 'settings' && <CabSettings />}
                </div>
            </div>
        </div>
    );
}
