import React, { useState, useEffect } from 'react';
import { expenditureService, baseService, equipmentService } from '../services/apiService.js';
import { FormInput, FormSelect, FormButton, FormTextarea, Toast } from '../components/FormComponents.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/Modal.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

export const ExpendituresPage = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    base_id: '',
    equipment_type_id: '',
    quantity: '',
    reason: '',
    expenditure_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expendituresRes, basesRes, equipmentRes] = await Promise.all([
        expenditureService.getAll(),
        baseService.getAll(),
        equipmentService.getAll(),
      ]);
      setExpenditures(expendituresRes.data.data);
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
      await expenditureService.create({
        ...formData,
        base_id: parseInt(formData.base_id),
        equipment_type_id: parseInt(formData.equipment_type_id),
        quantity: parseInt(formData.quantity),
      });
      Toast.success('Expenditure created successfully');
      setFormData({
        base_id: '',
        equipment_type_id: '',
        quantity: '',
        reason: '',
        expenditure_date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Failed to create expenditure');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Expenditures</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            New Expenditure
          </button>
        </div>

        <div className="card">
          <DataTable
            columns={[
              { key: 'base_name', label: 'Base' },
              { key: 'equipment_name', label: 'Equipment' },
              { key: 'quantity', label: 'Quantity' },
              { key: 'reason', label: 'Reason' },
              { key: 'expenditure_date', label: 'Date' },
            ]}
            data={expenditures}
            loading={loading}
          />
        </div>
      </div>

      <Modal isOpen={showForm} title="New Expenditure" onClose={() => setShowForm(false)}>
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
            type="number"
            label="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
          <FormSelect
            label="Reason"
            options={[
              { label: 'Maintenance', value: 'Maintenance' },
              { label: 'Training', value: 'Training' },
              { label: 'Field Operations', value: 'Field Operations' },
              { label: 'Damaged', value: 'Damaged' },
              { label: 'Lost', value: 'Lost' },
            ]}
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            required
          />
          <FormInput
            type="date"
            label="Expenditure Date"
            value={formData.expenditure_date}
            onChange={(e) => setFormData({ ...formData, expenditure_date: e.target.value })}
            required
          />
          <div className="flex gap-2">
            <FormButton>Create Expenditure</FormButton>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default ExpendituresPage;
