'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CabSettings() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/cabs/settings`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.data?.settings) {
        setSettings(data.data.settings);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/admin/cabs/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...settings,
          taxRate: settings.taxRate / 100, // Convert back to decimal for storage
        }),
      });
      
      if (!response.ok) throw new Error('Failed to save settings');
      
      const data = await response.json();
      setSettings(data.data.settings);
      alert('Settings saved successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Map the API response to the form fields
  const formData = {
    enableAutoAssignment: settings.autoAssignment || false,
    defaultPricing: settings.perKmRate || 10,
    maxDistance: settings.maxDistance || 50,
    notificationEmail: settings.notificationEmail || '',
    minBookingNotice: settings.minBookingNotice || 60,
    maxBookingDaysInAdvance: settings.maxBookingDaysInAdvance || 30,
    cancellationPolicy: settings.cancellationPolicy || '',
    baseFare: settings.baseFare || 50,
    perMinuteRate: settings.perMinuteRate || 1,
    nightSurcharge: settings.nightSurcharge || 1.2,
    peakHourSurcharge: settings.peakHourSurcharge || 1.1,
    taxRate: settings.taxRate ? settings.taxRate * 100 : 18, // Convert to percentage for display
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Cab Settings</h2>
      </div>

      <div className="bg-[var(--container-color)] border rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">General Settings</h3>
            <p className="text-sm text-[var(--text-color-light)]">Configure general cab management settings</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium mb-1">Enable Auto-Assignment</label>
                <p className="text-xs text-[var(--text-color-light)]">Automatically assign available cabs to bookings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enableAutoAssignment"
                  checked={formData.enableAutoAssignment}
                  onChange={(e) => {
                    setSettings(prev => ({
                      ...prev,
                      autoAssignment: e.target.checked
                    }));
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Default Price per KM ($)</label>
              <input
                type="number"
                name="defaultPricing"
                value={formData.perKmRate}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    perKmRate: parseFloat(e.target.value) || 0
                  }));
                }}
                min="0"
                step="0.01"
                className="w-full border rounded-md p-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Default price charged per kilometer</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Maximum Allowed Distance (km)</label>
              <input
                type="number"
                name="maxDistance"
                value={formData.maxDistance}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    maxDistance: parseInt(e.target.value) || 0
                  }));
                }}
                min="1"
                className="w-full border rounded-md p-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum allowed distance for a single booking</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notification Email</label>
              <input
                type="email"
                name="notificationEmail"
                value={formData.notificationEmail}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    notificationEmail: e.target.value
                  }));
                }}
                className="w-full border rounded-md p-2 text-sm"
                placeholder="email@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">Email to receive important cab service notifications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Booking Notice (minutes)</label>
              <input
                type="number"
                name="minBookingNotice"
                value={formData.minBookingNotice}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    minBookingNotice: parseInt(e.target.value) || 0
                  }));
                }}
                min="0"
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Booking Days in Advance</label>
              <input
                type="number"
                name="maxBookingDaysInAdvance"
                value={formData.maxBookingDaysInAdvance}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    maxBookingDaysInAdvance: parseInt(e.target.value) || 0
                  }));
                }}
                min="1"
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Base Fare ($)</label>
              <input
                type="number"
                name="baseFare"
                value={formData.baseFare}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    baseFare: parseFloat(e.target.value) || 0
                  }));
                }}
                min="0"
                step="0.01"
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Per Minute Rate ($)</label>
              <input
                type="number"
                name="perMinuteRate"
                value={formData.perMinuteRate}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    perMinuteRate: parseFloat(e.target.value) || 0
                  }));
                }}
                min="0"
                step="0.01"
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Night Surcharge (x)</label>
              <input
                type="number"
                name="nightSurcharge"
                value={formData.nightSurcharge}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    nightSurcharge: parseFloat(e.target.value) || 1
                  }));
                }}
                min="1"
                step="0.1"
                className="w-full border rounded-md p-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Multiplier for night time fares (e.g., 1.2 for 20% extra)</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Peak Hour Surcharge (x)</label>
              <input
                type="number"
                name="peakHourSurcharge"
                value={formData.peakHourSurcharge}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    peakHourSurcharge: parseFloat(e.target.value) || 1
                  }));
                }}
                min="1"
                step="0.1"
                className="w-full border rounded-md p-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Multiplier for peak hour fares</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    taxRate: parseFloat(e.target.value) / 100 || 0
                  }));
                }}
                min="0"
                max="100"
                step="0.1"
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
