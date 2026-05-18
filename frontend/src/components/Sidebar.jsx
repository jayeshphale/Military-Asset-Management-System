import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getNavItems = () => {
    const baseItems = [
      { label: 'Dashboard', href: '/dashboard' },
    ];

    if (user?.role === 'Admin') {
      return [
        ...baseItems,
        { label: 'Users', href: '/users' },
        { label: 'Bases', href: '/bases' },
        { label: 'Equipment', href: '/equipment' },
        { label: 'Purchases', href: '/purchases' },
        { label: 'Transfers', href: '/transfers' },
        { label: 'Assignments', href: '/assignments' },
        { label: 'Expenditures', href: '/expenditures' },
        { label: 'Inventory', href: '/inventory' },
        { label: 'Audit Logs', href: '/audit-logs' },
      ];
    } else if (user?.role === 'Base Commander') {
      return [
        ...baseItems,
        { label: 'Inventory', href: '/inventory' },
        { label: 'Assignments', href: '/assignments' },
        { label: 'Expenditures', href: '/expenditures' },
      ];
    } else if (user?.role === 'Logistics Officer') {
      return [
        ...baseItems,
        { label: 'Purchases', href: '/purchases' },
        { label: 'Transfers', href: '/transfers' },
        { label: 'Inventory', href: '/inventory' },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-military-accent p-2 rounded-lg text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-military-dark border-r border-gray-700 transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-military-accent mb-8">Military Asset</h1>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-military-lighter transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="text-sm mb-4">
              <p className="text-gray-400">User</p>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-xs text-military-accent">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
