import React, { useState, useEffect } from 'react';
import { userService, baseService } from '../services/apiService.js';
import { FormInput, FormSelect, FormButton, Toast } from '../components/FormComponents.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/Modal.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import { useAuth } from '../hooks/useAuth.js';

export const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Base Commander',
    assigned_base_id: '',
  });

  useEffect(() => {
    if (currentUser?.role === 'Admin') {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const [usersRes, basesRes] = await Promise.all([
        userService.getAll(),
        baseService.getAll(),
      ]);
      setUsers(usersRes.data.data);
      setBases(basesRes.data.data);
    } catch (error) {
      Toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.create({
        ...formData,
        assigned_base_id: formData.assigned_base_id ? parseInt(formData.assigned_base_id) : null,
      });
      Toast.success('User created successfully');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Base Commander',
        assigned_base_id: '',
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await userService.delete(userId);
        Toast.success('User deleted successfully');
        fetchData();
      } catch (error) {
        Toast.error('Failed to delete user');
      }
    }
  };

  if (currentUser?.role !== 'Admin') {
    return <MainLayout><div className="text-red-500">Access denied</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            New User
          </button>
        </div>

        <div className="card">
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role' },
              { key: 'assigned_base_id', label: 'Base ID' },
            ]}
            data={users}
            loading={loading}
            actions={[
              {
                label: 'Delete',
                variant: 'danger',
                onClick: (row) => handleDelete(row.id),
              },
            ]}
          />
        </div>
      </div>

      <Modal isOpen={showForm} title="New User" onClose={() => setShowForm(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="text"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormInput
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <FormInput
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <FormSelect
            label="Role"
            options={[
              { label: 'Admin', value: 'Admin' },
              { label: 'Base Commander', value: 'Base Commander' },
              { label: 'Logistics Officer', value: 'Logistics Officer' },
            ]}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
          <FormSelect
            label="Assigned Base (Optional)"
            options={bases.map((b) => ({ label: b.name, value: b.id }))}
            value={formData.assigned_base_id}
            onChange={(e) => setFormData({ ...formData, assigned_base_id: e.target.value })}
          />
          <div className="flex gap-2">
            <FormButton>Create User</FormButton>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default UsersPage;
