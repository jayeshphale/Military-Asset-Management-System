import React, { useState, useEffect } from 'react';
import { transferService, baseService, equipmentService } from '../services/apiService.js';
import { FormInput, FormSelect, FormButton, FormTextarea, Toast } from '../components/FormComponents.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { Modal } from '../components/Modal.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

export const TransfersPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    from_base_id: '',
    to_base_id: '',
    equipment_type_id: '',
    quantity: '',
    transfer_date: new Date().toISOString().split('T')[0],
    remarks: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transfersRes, basesRes, equipmentRes] = await Promise.all([
        transferService.getAll(),
        baseService.getAll(),
        equipmentService.getAll(),
      ]);
      setTransfers(transfersRes.data.data);
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
    if (formData.from_base_id === formData.to_base_id) {
      Toast.error('Source and destination bases must be different');
      return;
    }

    try {
      await transferService.create({
        ...formData,
        from_base_id: parseInt(formData.from_base_id),
        to_base_id: parseInt(formData.to_base_id),
        equipment_type_id: parseInt(formData.equipment_type_id),
        quantity: parseInt(formData.quantity),
      });
      Toast.success('Transfer created successfully');
      setFormData({
        from_base_id: '',
        to_base_id: '',
        equipment_type_id: '',
        quantity: '',
        transfer_date: new Date().toISOString().split('T')[0],
        remarks: '',
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Failed to create transfer');
    }
  };

  const handleStatusChange = async (transferId, newStatus) => {
    try {
      await transferService.updateStatus(transferId, newStatus);
      Toast.success('Transfer status updated');
      fetchData();
    } catch (error) {
      Toast.error('Failed to update status');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Transfers</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            New Transfer
          </button>
        </div>

        <div className="card">
          <DataTable
            columns={[
              { key: 'from_base_name', label: 'From' },
              { key: 'to_base_name', label: 'To' },
              { key: 'equipment_name', label: 'Equipment' },
              { key: 'quantity', label: 'Quantity' },
              { key: 'status', label: 'Status' },
              {
                key: 'id',
                label: 'Action',
                render: (row) =>
                  row.status === 'Pending' ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStatusChange(row.id, 'Completed')}
                        className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(row.id, 'Rejected')}
                        className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  ),
              },
            ]}
            data={transfers}
            loading={loading}
          />
        </div>
      </div>

      <Modal isOpen={showForm} title="New Transfer" onClose={() => setShowForm(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSelect
            label="From Base"
            options={bases.map((b) => ({ label: b.name, value: b.id }))}
            value={formData.from_base_id}
            onChange={(e) => setFormData({ ...formData, from_base_id: e.target.value })}
            required
          />
          <FormSelect
            label="To Base"
            options={bases.map((b) => ({ label: b.name, value: b.id }))}
            value={formData.to_base_id}
            onChange={(e) => setFormData({ ...formData, to_base_id: e.target.value })}
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
          <FormInput
            type="date"
            label="Transfer Date"
            value={formData.transfer_date}
            onChange={(e) => setFormData({ ...formData, transfer_date: e.target.value })}
            required
          />
          <FormTextarea
            label="Remarks"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          />
          <div className="flex gap-2">
            <FormButton>Create Transfer</FormButton>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default TransfersPage;
