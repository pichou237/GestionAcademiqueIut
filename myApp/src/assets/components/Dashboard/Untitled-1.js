// src/pages/DashboardPage.tsx
import DashboardLayout from './DashboardLayout';
import { AcademicCapIcon, CalendarIcon, ChartBarIcon, UserCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, trend }: { 
  title: string; 
  value: string | number;
  icon: React.ElementType;
  trend?: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className={`p-4 rounded-lg ${trend === 'up' ? 'bg-green-100' : 'bg-blue-100'}`}>
        <Icon className={`h-8 w-8 ${trend === 'up' ? 'text-green-600' : 'text-blue-600'}`} />
      </div>
    </div>
  </div>
);

const QuickAction = ({ title, icon: Icon, count }: { 
  title: string; 
  icon: React.ElementType;
  count?: number;
}) => (
  <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center">
      <Icon className="h-6 w-6 text-blue-600 mr-4" />
      <span className="text-gray-700">{title}</span>
      {count && <span className="ml-auto bg-blue-100 text-blue-600 px-3 py-1 rounded-full">{count}</span>}
    </div>
  </button>
);

const DashboardPage = () => (
  <DashboardLayout>
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-gray-800">Tableau de bord</h2>
      <div className="flex items-center">
        <UserCircleIcon className="h-8 w-8 text-gray-600 mr-2" />
        <span className="text-gray-700">Idrisschakam02</span>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        title="Étudiants" 
        value={350} 
        icon={UserGroupIcon} 
      />
      <StatCard
        title="Taux de présence"
        value="80%"
        icon={ChartBarIcon}
        trend="up"
      />
      <StatCard
        title="Séances"
        value={120}
        icon={CalendarIcon}
      />
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <QuickAction 
        title="Gérer les présences" 
        icon={CalendarIcon}
        count={5}
      />
      <QuickAction 
        title="Ajouter un enseignant" 
        icon={AcademicCapIcon}
      />
      <QuickAction 
        title="Importer étudiants" 
        icon={UserGroupIcon}
      />
      <QuickAction 
        title="Générer rapports" 
        icon={ChartBarIcon}
      />
    </div>
  </DashboardLayout>
);

export default DashboardPage;