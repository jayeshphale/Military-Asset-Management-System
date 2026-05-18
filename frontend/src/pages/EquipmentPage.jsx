import React, { useState, useEffect } from 'react';
import { equipmentService } from '../services/apiService.js';
import { DataTable } from '../components/DataTable.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import { Toast } from '../components/FormComponents.jsx';

export const EquipmentPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await equipmentService.getAll();
      setEquipment(res.data.data);
    } catch (err) {
      Toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Equipment</h1>
        </div>

        <div className="card">
          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'category', label: 'Category' },
              { key: 'unit', label: 'Unit' },
            ]}
            data={equipment}
            loading={loading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default EquipmentPage;
