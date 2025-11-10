'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Plus, Edit, Trash2, Eye, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CabList() {
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [cabToDelete, setCabToDelete] = useState(null);
  const [editingCab, setEditingCab] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'economy',
    capacity: 4,
    registrationNumber: '',
    pricePerKm: 0,
    isAvailable: true,
    driver: { name: '', phone: '', licenseNumber: '' },
    features: [],
    routes: [{ from: '', to: '', isActive: true }],
  });
  
  const [newRoute, setNewRoute] = useState({ from: '', to: '', isActive: true });
  const [newFeature, setNewFeature] = useState('');

  const router = useRouter();

  const fetchCabs = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/cabs`, { credentials: 'include' });
      const data = await res.json();
      setCabs(data.data?.cabs || []);
    } catch (err) {
      console.error('Error fetching cabs:', err);
      alert('Failed to fetch cabs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDriverChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      driver: { ...prev.driver, [name]: value },
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleAddFeature = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const removeFeature = (i) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== i),
    }));
  };
  
  const handleRouteChange = (index, field, value) => {
    const updatedRoutes = [...formData.routes];
    updatedRoutes[index] = { ...updatedRoutes[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      routes: updatedRoutes,
    }));
  };

  const addRoute = () => {
    if (newRoute.from && newRoute.to) {
      setFormData(prev => ({
        ...prev,
        routes: [...prev.routes, newRoute],
      }));
      setNewRoute({ from: '', to: '', isActive: true });
    }
  };

  const removeRoute = (index) => {
    setFormData(prev => ({
      ...prev,
      routes: prev.routes.filter((_, i) => i !== index),
    }));
  };

  const handleAddNew = () => {
    setEditingCab(null);
    setFormData({
      name: '',
      type: 'economy',
      capacity: 4,
      registrationNumber: '',
      pricePerKm: 0,
      isAvailable: true,
      driver: { name: '', phone: '', licenseNumber: '' },
      features: [],
      routes: [{ from: '', to: '', isActive: true }],
    });
    setNewRoute({ from: '', to: '', isActive: true });
    setIsFormOpen(true);
  };

  const handleEdit = (cab) => {
    setEditingCab(cab);
    setFormData({
      name: cab.name,
      type: cab.type,
      capacity: cab.capacity,
      registrationNumber: cab.registrationNumber,
      pricePerKm: cab.pricePerKm,
      isAvailable: cab.isAvailable,
      driver: cab.driver || { name: '', phone: '', licenseNumber: '' },
      features: cab.features || [],
      routes: cab.routes?.length ? cab.routes : [{ from: '', to: '', isActive: true }],
    });
    setNewRoute({ from: '', to: '', isActive: true });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCab
      ? `${API_URL}/admin/cabs/${editingCab._id}`
      : `${API_URL}/admin/cabs`;
    const method = editingCab ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchCabs();
      setIsFormOpen(false);
      alert(`Cab ${editingCab ? 'updated' : 'added'} successfully`);
    } catch {
      alert('Failed to save cab');
    }
  };

  const handleDelete = async () => {
    if (!cabToDelete) return;
    try {
      const res = await fetch(`${API_URL}/admin/cabs/${cabToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      await fetchCabs();
      setIsDeleteOpen(false);
      alert('Cab deleted successfully');
    } catch {
      alert('Failed to delete cab');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Cabs</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[var(--button-bg-color)] text-[var(--button-color)] px-4 py-2 rounded-md hover:bg-[var(--button-hover-color)] transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Cab
        </button>
      </div>

      <div className="bg-[var(--container-color)] shadow border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Cab List</h3>
          <p className="text-sm text-[var(--text-color-light)]">Manage your fleet of cabs</p>
        </div>

        {cabs.length === 0 ? (
          <div className="text-center py-12">
            <Car className="mx-auto h-10 w-10 text-[var(--text-color-light)]" />
            <h3 className="mt-2 text-lg font-semibold">No cabs found</h3>
            <p className="text-[var(--text-color-light)]">Add a new cab to get started.</p>
            <button
              className="mt-4 px-4 py-2 bg-[var(--button-bg-color)] text-[var(--button-color)] rounded-md hover:bg-[var(--button-hover-color)] transition cursor-pointer"
              onClick={handleAddNew}
            >
              <Plus className="inline h-4 w-4 mr-2" /> Add Cab
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Registration</th>
                  <th className="p-3">Driver</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Price/Km</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cabs.map((cab) => (
                  <tr key={cab._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{cab.name}</td>
                    <td className="p-3 capitalize">{cab.type}</td>
                    <td className="p-3">{cab.registrationNumber}</td>
                    <td className="p-3">{cab.driver?.name || 'N/A'}</td>
                    <td className="p-3">{cab.capacity}</td>
                    <td className="p-3">${cab.pricePerKm}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${cab.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {cab.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => router.push(`/admin/cabs/${cab._id}`)}
                        className="p-2 hover:bg-gray-100 rounded-md"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleEdit(cab)}
                        className="p-2 hover:bg-gray-100 rounded-md"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => {
                          setCabToDelete(cab);
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-md"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-[var(--container-color)] rounded-lg shadow-lg w-full max-w-2xl px-6 py-4 relative max-h-[90vh] overflow-y-auto">

            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setIsFormOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editingCab ? 'Edit Cab' : 'Add New Cab'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Cab Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-md px-2 py-1 bg-[var(--container-color-in)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Cab Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-2 py-1 bg-[var(--container-color-in)] cursor-pointer"
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                    <option value="suv">SUV</option>
                    <option value="minivan">Minivan</option>
                  </select>
                </div>
              </div>

              {/* Registration + Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Registration</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-md px-2 py-1 bg-[var(--container-color-in)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-2 py-1 bg-[var(--container-color-in)]"
                    min={1}
                    max={10}
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium">Price per KM ($)</label>
                <input
                  type="number"
                  name="pricePerKm"
                  value={formData.pricePerKm}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-2 py-1 bg-[var(--container-color-in)]"
                />
              </div>

              {/* Driver Info */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Driver Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Driver Name"
                    value={formData.driver.name}
                    onChange={handleDriverChange}
                    className="border rounded-md px-2 py-1 bg-[var(--container-color-in)]"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.driver.phone}
                    onChange={handleDriverChange}
                    className="border rounded-md px-2 py-1 bg-[var(--container-color-in)]"
                  />
                </div>
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="License Number"
                  value={formData.driver.licenseNumber}
                  onChange={handleDriverChange}
                  className="border rounded-md px-2 py-1 w-full mt-2 bg-[var(--container-color-in)]"
                />
              </div>

              {/* Features */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Features</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm text-gray-800">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="newFeature"
                    placeholder="Enter feature name"
                    className="flex-1 border rounded-md px-3 py-2 bg-[var(--container-color-in)]"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!newFeature.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Routes */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Routes</h4>
                {formData.routes.map((route, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 mb-2 items-center">
                    <input
                      type="text"
                      placeholder="From (City)"
                      value={route.from}
                      onChange={(e) => handleRouteChange(index, 'from', e.target.value)}
                      className="border rounded-md px-2 py-1 bg-[var(--container-color-in)]"
                    />
                    <span className="text-center">→</span>
                    <input
                      type="text"
                      placeholder="To (City)"
                      value={route.to}
                      onChange={(e) => handleRouteChange(index, 'to', e.target.value)}
                      className="border rounded-md px-2 py-1 bg-[var(--container-color-in)]"
                    />
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={route.isActive}
                          onChange={(e) => handleRouteChange(index, 'isActive', e.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="ml-1 text-sm">Active</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeRoute(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="grid grid-cols-5 gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="From (City)"
                    value={newRoute.from}
                    onChange={(e) => setNewRoute({...newRoute, from: e.target.value})}
                    className="border rounded-md px-2 py-1 bg-[var(--container-color-in)]"
                  />
                  <span className="text-center">→</span>
                  <input
                    type="text"
                    placeholder="To (City)"
                    value={newRoute.to}
                    onChange={(e) => setNewRoute({...newRoute, to: e.target.value})}
                    className="border rounded-md px-2 py-1 bg-[var(--container-color-in)]"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={addRoute}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Add at least one route for this cab
                </p>
              </div>

              {/* Availability */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <span>Available for booking</span>
              </label>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[var(--button-bg-color)] text-[var(--button-color)] px-4 py-2 rounded-md hover:bg-[var(--button-hover-color)] transition cursor-pointer"
                >
                  {editingCab ? 'Update Cab' : 'Add Cab'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold">Delete Cab</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete <strong>{cabToDelete?.name}</strong>?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex items-center gap-2 bg-[var(--button-bg-color)] text-[var(--button-color)] px-4 py-2 rounded-md hover:bg-[var(--button-hover-color)] transition cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
