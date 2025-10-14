'use client';

import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    active: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/v1/admin/users', {
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await res.json();
      setUsers(data.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active !== false, // Default to true if undefined
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      active: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateUser = async (userId) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedUser = await res.json();
      setUsers(users.map(user => 
        user._id === userId ? { ...user, ...updatedUser.data.user } : user
      ));
      
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update user status');
      }

      const updatedUser = await res.json();
      setUsers(users.map(user => 
        user._id === userId ? { ...user, active: updatedUser.data.user.active } : user
      ));
      
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error(error.message || 'Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-lg font-medium text-[var(--text-color)]">Users</h2>
            <p className="mt-2 text-sm text-[var(--text-color)]">
              A list of all the users in your application including their name, email and role.
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-[var(--container-color-in)]">
                  <thead className="bg-[var(--container-color)]">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[var(--text-color)] sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--text-color)]">
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--text-color)]">
                        Role
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--text-color)]">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--container-color)] bg-[var(--container-color-in)]">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-[var(--text-color)] sm:pl-6">
                          {editingUser === user._id ? (
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="block w-full px-2 py-1 rounded-sm bg-[var(--container-color)] shadow-sm focus:border-[var(--container-color)] focus:ring-[var(--container-color)] sm:text-sm"
                            />
                          ) : (
                            user.name
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--text-color)]">
                          {editingUser === user._id ? (
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="block w-full px-2 py-1 rounded-sm bg-[var(--container-color)] shadow-sm focus:border-[var(--container-color)] focus:ring-[var(--container-color)] sm:text-sm"
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--text-color)]">
                          {editingUser === user._id ? (
                            <select
                              name="role"
                              value={formData.role}
                              onChange={handleInputChange}
                              className="block w-full rounded-sm py-2 pl-3 pr-10 text-base bg-[var(--container-color)] focus:border-[var(--container-color)] focus:outline-none focus:ring-[var(--container-color)] sm:text-sm"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span 
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.active !== false 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {editingUser === user._id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUpdateUser(user._id)}
                                className="text-[var(--text-color)] hover:text-red-600 bg-[var(--container-color)] px-1 rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-[var(--text-color)] hover:text-red-600 bg-[var(--container-color)] px-1 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleUserStatus(user._id, user.active !== false)}
                                className="text-gray-400 hover:text-gray-500"
                                title={user.active !== false ? 'Deactivate user' : 'Activate user'}
                              >
                                {user.active !== false ? (
                                  <FiUserX className="h-5 w-5" />
                                ) : (
                                  <FiUserCheck className="h-5 w-5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEditClick(user)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit user"
                              >
                                <FiEdit2 className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete user"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
