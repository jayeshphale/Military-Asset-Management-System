import React, { useState, useEffect } from 'react';
import { dashboardService, purchaseService, transferService } from '../services/apiService.js';
import { SimpleBarChart, SimplePieChart } from '../components/Charts.jsx';
import { Modal } from '../components/Modal.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { useAuth } from '../hooks/useAuth.js';
import MainLayout from '../layouts/MainLayout.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNetMovement, setShowNetMovement] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const summaryRes = await dashboardService.getSummary();
      setSummary(summaryRes.data.data);

      const purchasesRes = await purchaseService.getAll();
      setPurchases(purchasesRes.data.data);

      const transfersRes = await transferService.getAll();
      setTransfers(transfersRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return <MainLayout><div className="text-center py-8">Loading dashboard...</div></MainLayout>;
  }

  const dashboardCards = [
    {
      title: 'Opening Balance',
      value: summary.opening_balance,
      color: 'bg-blue-600',
    },
    {
      title: 'Current Balance',
      value: summary.current_balance,
      color: 'bg-green-600',
    },
    {
      title: 'Net Movement',
      value: summary.net_movement,
      color: 'bg-yellow-600',
      onClick: () => setShowNetMovement(true),
    },
    {
      title: 'Assigned',
      value: summary.assigned,
      color: 'bg-purple-600',
    },
    {
      title: 'Expended',
      value: summary.expended,
      color: 'bg-red-600',
    },
    {
      title: 'Closing Balance',
      value: summary.closing_balance,
      color: 'bg-indigo-600',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardCards.map((card) => (
            <div
              key={card.title}
              className={`${card.color} p-6 rounded-lg text-white cursor-pointer hover:opacity-90 transition-opacity`}
              onClick={card.onClick}
            >
              <h3 className="text-sm font-semibold opacity-80">{card.title}</h3>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleBarChart
            data={[
              { name: 'Opening', value: summary.opening_balance },
              { name: 'Current', value: summary.current_balance },
              { name: 'Assigned', value: summary.assigned },
              { name: 'Expended', value: summary.expended },
            ]}
            xKey="name"
            yKey="value"
            title="Inventory Overview"
          />

          <SimplePieChart
            data={[
              { name: 'Available', value: summary.closing_balance },
              { name: 'Assigned', value: summary.assigned },
              { name: 'Expended', value: summary.expended },
            ]}
            dataKey="value"
            nameKey="name"
            title="Inventory Distribution"
          />
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Transactions</h2>
          <DataTable
            columns={[
              { key: 'type', label: 'Type' },
              { key: 'equipment_type_id', label: 'Equipment' },
              { key: 'quantity', label: 'Quantity' },
              { key: 'created_at', label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
            ]}
            data={summary.recent_transactions || []}
          />
        </div>
      </div>

      {/* Net Movement Modal */}
      <Modal isOpen={showNetMovement} title="Net Movement Details" onClose={() => setShowNetMovement(false)} size="xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Purchases</h3>
            <DataTable
              columns={[
                { key: 'base_name', label: 'Base' },
                { key: 'equipment_name', label: 'Equipment' },
                { key: 'quantity', label: 'Quantity' },
              ]}
              data={purchases}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Transfers In</h3>
            <DataTable
              columns={[
                { key: 'from_base_name', label: 'From' },
                { key: 'to_base_name', label: 'To' },
                { key: 'quantity', label: 'Quantity' },
              ]}
              data={transfers.filter((t) => t.status === 'Completed')}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Transfers Out</h3>
            <DataTable
              columns={[
                { key: 'from_base_name', label: 'From' },
                { key: 'to_base_name', label: 'To' },
                { key: 'quantity', label: 'Quantity' },
              ]}
              data={transfers.filter((t) => t.status === 'Completed')}
            />
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default DashboardPage;
