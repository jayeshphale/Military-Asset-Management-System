import React, { useState, useEffect } from 'react';
import { baseService, inventoryService } from '../services/apiService.js';
import { DataTable } from '../components/DataTable.jsx';
import { FormSelect, Toast } from '../components/FormComponents.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

export const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [bases, setBases] = useState([]);
  const [selectedBase, setSelectedBase] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const basesRes = await baseService.getAll();
      const baseList = basesRes.data.data;
      setBases(baseList);
      if (baseList.length > 0) {
        const firstBase = baseList[0].id;
        setSelectedBase(firstBase);
        await fetchInventory(firstBase);
      }
    } catch (error) {
      Toast.error('Failed to fetch bases');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async (baseId) => {
    setLoading(true);
    try {
      const inventoryRes = await inventoryService.getByBase(baseId);
      setInventory(inventoryRes.data.data);
    } catch (error) {
      Toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleBaseChange = async (e) => {
    const baseId = parseInt(e.target.value, 10);
    setSelectedBase(baseId);
    await fetchInventory(baseId);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Inventory</h1>

        <div className="card">
          <FormSelect
            label="Select Base"
            options={bases.map((b) => ({ label: b.name, value: b.id }))}
            value={selectedBase}
            onChange={handleBaseChange}
          />
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-4">Inventory Details</h2>
          <DataTable
            columns={[
              { key: 'name', label: 'Equipment' },
              { key: 'opening_balance', label: 'Opening' },
              { key: 'current_balance', label: 'Current' },
              { key: 'unit', label: 'Unit' },
            ]}
            data={inventory}
            loading={loading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default InventoryPage;
