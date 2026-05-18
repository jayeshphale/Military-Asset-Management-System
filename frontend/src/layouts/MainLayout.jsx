import React from 'react';
import Sidebar from '../components/Sidebar.jsx';

export const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-military-dark">
      <Sidebar />
      <main className="flex-1 overflow-auto md:ml-64">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
