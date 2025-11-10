'use client';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CabDrivers() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        licenseNumber: '',
        licenseExpiry: '',
        address: '',
        status: 'active',
        joiningDate: format(new Date(), 'yyyy-MM-dd'),
    });
    const [cabs, setCabs] = useState([]);
    const [assignedCabs, setAssignedCabs] = useState({});

    const fetchDrivers = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/cabs/drivers`, { credentials: 'include' });
            const data = await res.json();
            setDrivers(data?.data?.drivers || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCabs = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/cabs`, { credentials: 'include' });
            const data = await res.json();
            const cabsData = data?.data?.cabs || [];
            setCabs(cabsData);

            // Create a new map with driver IDs as keys and cab IDs as values
            const newAssignedCabs = cabsData.reduce((acc, cab) => {
                if (cab.driver?._id) {
                    acc[cab.driver._id] = cab._id;
                }
                return acc;
            }, {});
            
            setAssignedCabs(newAssignedCabs);
        } catch (err) {
            console.error('Error fetching cabs:', err);
        }
    };

    useEffect(() => {
        fetchDrivers();
        fetchCabs();
    }, []);

    const handleAdd = () => {
        setEditingDriver(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            licenseNumber: '',
            licenseExpiry: '',
            address: '',
            status: 'active',
            joiningDate: format(new Date(), 'yyyy-MM-dd'),
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (driver) => {
        setEditingDriver(driver);
        setFormData({
            name: driver.name || '',
            email: driver.email || '',
            phone: driver.phone || '',
            licenseNumber: driver.licenseNumber || '',
            licenseExpiry: driver.licenseExpiry
                ? format(new Date(driver.licenseExpiry), 'yyyy-MM-dd')
                : '',
            address: driver.address || '',
            status: driver.status || 'active',
            joiningDate: driver.joiningDate
                ? format(new Date(driver.joiningDate), 'yyyy-MM-dd')
                : format(new Date(), 'yyyy-MM-dd'),
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this driver?')) return;
        await fetch(`${API_URL}/admin/cabs/drivers/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        fetchDrivers();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingDriver
            ? `${API_URL}/admin/cabs/drivers/${editingDriver._id}`
            : `${API_URL}/admin/cabs/drivers`;
        const method = editingDriver ? 'PATCH' : 'POST';
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData),
        });
        setIsDialogOpen(false);
        fetchDrivers();
    };

    const getAssignedCab = (driverId) => {
        const cabId = assignedCabs[driverId];
        const cab = cabs.find((c) => c._id === cabId);
        return cab ? `${cab.name} (${cab.registrationNumber})` : 'Not Assigned';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-10 w-10 border-4 border-t-blue-500 border-gray-300 rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Manage Drivers</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-[var(--button-bg-color)] text-[var(--button-color)] px-4 py-2 rounded-md hover:bg-[var(--button-hover-color)] transition cursor-pointer"
                >
                    + Add Driver
                </button>
            </div>

            <div className="bg-[var(--container-color)] border rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-2">Driver List</h3>
                {drivers.length === 0 ? (
                    <div className="text-center py-8 text-[var(--text-color-light)]">No drivers found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-2 text-left">Driver</th>
                                    <th className="p-2 text-left">Contact</th>
                                    <th className="p-2 text-left">License</th>
                                    <th className="p-2 text-left">Assigned Cab</th>
                                    <th className="p-2 text-left">Status</th>
                                    <th className="p-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map((driver) => (
                                    <tr key={driver._id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">
                                            <div className="font-medium">{driver.name}</div>
                                            <div className="text-gray-500 text-sm">{driver.email}</div>
                                        </td>
                                        <td className="p-2">{driver.phone || 'N/A'}</td>
                                        <td className="p-2">
                                            <div>{driver.licenseNumber || 'N/A'}</div>
                                            {driver.licenseExpiry && (
                                                <div className="text-xs text-gray-500">
                                                    Exp: {format(new Date(driver.licenseExpiry), 'MMM d, yyyy')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-2">{getAssignedCab(driver._id)}</td>
                                        <td className="p-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${driver.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : driver.status === 'inactive'
                                                            ? 'bg-gray-200 text-gray-700'
                                                            : driver.status === 'on_leave'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {driver.status}
                                            </span>
                                        </td>
                                        <td className="p-2 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(driver)}
                                                className="flex items-center gap-2 bg-[var(--button-bg-color)] text-[var(--button-color)] px-4 py-2 rounded-md hover:bg-[var(--button-hover-color)] transition cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(driver._id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-2">
                            {editingDriver ? 'Edit Driver' : 'Add New Driver'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border px-3 py-2 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border px-3 py-2 rounded"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full border px-3 py-2 rounded"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="on_leave">On Leave</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">License Number</label>
                                    <input
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={(e) =>
                                            setFormData({ ...formData, licenseNumber: e.target.value })
                                        }
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">License Expiry</label>
                                    <input
                                        type="date"
                                        name="licenseExpiry"
                                        value={formData.licenseExpiry}
                                        onChange={(e) =>
                                            setFormData({ ...formData, licenseExpiry: e.target.value })
                                        }
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Joining Date</label>
                                <input
                                    type="date"
                                    name="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, joiningDate: e.target.value })
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="px-4 py-2 border rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                >
                                    {editingDriver ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
