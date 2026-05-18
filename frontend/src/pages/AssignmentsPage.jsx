import React, { useState, useEffect } from 'react';
import { assignmentService, baseService, equipmentService } from '../services/apiService.js';
import { FormInput, FormSelect, FormButton, Toast } from '../components/FormComponents.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/Modal.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

export const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    base_id: '',
    equipment_type_id: '',
    assigned_to: '',
    quantity: '',
    assignment_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, basesRes, equipmentRes] = await Promise.all([
        assignmentService.getAll(),
        baseService.getAll(),
        equipmentService.getAll(),
      ]);
      setAssignments(assignmentsRes.data.data);
      setBases(basesRes.data.data);
      setEquipment(equipmentRes.data.data);
    } catch (error) {
      Toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignmentService.create({
        ...formData,
        base_id: parseInt(formData.base_id),
        equipment_type_id: parseInt(formData.equipment_type_id),
        quantity: parseInt(formData.quantity),
      });
      Toast.success('Assignment created successfully');
      setFormData({
        base_id: '',
        equipment_type_id: '',
        assigned_to: '',
        quantity: '',
        assignment_date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Failed to create assignment');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Assignments</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            New Assignment
          </button>
        </div>

        <div className="card">
          <DataTable
            columns={[
              { key: 'base_name', label: 'Base' },
              { key: 'equipment_name', label: 'Equipment' },
              { key: 'assigned_to', label: 'Assigned To' },
              { key: 'quantity', label: 'Quantity' },
              { key: 'assignment_date', label: 'Date' },
            ]}
            data={assignments}
            loading={loading}
          />
        </div>
      </div>

      <Modal isOpen={showForm} title="New Assignment" onClose={() => setShowForm(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSelect
            label="Base"
            options={bases.map((b) => ({ label: b.name, value: b.id }))}
            value={formData.base_id}
            onChange={(e) => setFormData({ ...formData, base_id: e.target.value })}
            required
          />
          <FormSelect
            label="Equipment"
            options={equipment.map((e) => ({ label: e.name, value: e.id }))}
            value={formData.equipment_type_id}
            onChange={(e) => setFormData({ ...formData, equipment_type_id: e.target.value })}
            required
          />
          <FormInput
            type="text"
            label="Assigned To"
            value={formData.assigned_to}
            onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
            placeholder="Personnel name"
            required
          />
          <FormInput
            type="number"
            label="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
          <FormInput
            type="date"
            label="Assignment Date"
            value={formData.assignment_date}
            onChange={(e) => setFormData({ ...formData, assignment_date: e.target.value })}
            required
          />
          <div className="flex gap-2">
            <FormButton>Create Assignment</FormButton>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default AssignmentsPage;
