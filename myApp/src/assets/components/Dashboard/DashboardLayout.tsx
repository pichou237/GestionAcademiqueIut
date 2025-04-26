// src/components/DashboardLayout.tsx
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ChartBarIcon, UserGroupIcon, AcademicCapIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <div className="min-h-screen bg-gray-50 flex">
    {/* Sidebar */}
    <aside className="w-64 bg-white shadow-lg fixed h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">CampusManager</h1>
      </div>
      <nav className="mt-8">
        {[
          { name: 'Présences', icon: ChartBarIcon, to: '/presences' },
          { name: 'Enseignants', icon: AcademicCapIcon, to: '/teacher' },
          { name: 'Étudiants', icon: UserGroupIcon, to: '/etudiants' },
          { name: 'Planning', icon: CalendarIcon, to: '/seances' },
          { name: 'Presences', icon: AcademicCapIcon, to: '/presences' },
          { name: 'salles', icon: UserGroupIcon, to: '/salles' },
          { name: 'cours', icon: CalendarIcon, to: '/cours' },
        ].map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 ${
                isActive ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>

    {/* Main Content */}
    <main className="flex-1 ml-64 p-8">{children}</main>
  </div>
);

export default DashboardLayout;