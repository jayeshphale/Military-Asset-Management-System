import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PurchasesPage from './pages/PurchasesPage.jsx';
import TransfersPage from './pages/TransfersPage.jsx';
import AssignmentsPage from './pages/AssignmentsPage.jsx';
import ExpendituresPage from './pages/ExpendituresPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import AuditLogsPage from './pages/AuditLogsPage.jsx';
import BasesPage from './pages/BasesPage.jsx';
import EquipmentPage from './pages/EquipmentPage.jsx';

import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/purchases"
            element={
              <PrivateRoute allowedRoles={['Admin', 'Logistics Officer']}>
                <PurchasesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/equipment"
            element={
              <PrivateRoute>
                <EquipmentPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/bases"
            element={
              <PrivateRoute allowedRoles={['Admin']}>
                <BasesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/transfers"
            element={
              <PrivateRoute allowedRoles={['Admin', 'Logistics Officer']}>
                <TransfersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/assignments"
            element={
              <PrivateRoute allowedRoles={['Admin', 'Base Commander']}>
                <AssignmentsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/expenditures"
            element={
              <PrivateRoute allowedRoles={['Admin', 'Base Commander']}>
                <ExpendituresPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <InventoryPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute allowedRoles={['Admin']}>
                <UsersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/audit-logs"
            element={
              <PrivateRoute allowedRoles={['Admin']}>
                <AuditLogsPage />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
