// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { 
  AcademicCapIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  UserCircleIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  RadarChart, 
  ScatterChart,
  Line, 
  Bar, 
  Pie,
  Radar,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis 
} from 'recharts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Données factices
const mockData = {
  students: 350,
  presenceRate: 80,
  sessions: 120,
  attendanceTrend: [
    { month: 'Jan', presence: 65 },
    { month: 'Fév', presence: 75 },
    { month: 'Mar', presence: 82 },
    { month: 'Avr', presence: 78 },
    { month: 'Mai', presence: 85 },
  ],
  classDistribution: [
    { name: 'GL A', students: 45 },
    { name: 'GL B', students: 38 },
    { name: 'RT', students: 28 },
    { name: 'IIA', students: 32 },
  ],
  presenceDistribution: [
    { name: 'Présents', value: 80 },
    { name: 'Absents', value: 20 },
  ],
  performanceData: [
    { subject: 'Maths', score: 75 },
    { subject: 'Info', score: 85 },
    { subject: 'Physique', score: 65 },
    { subject: 'Anglais', score: 70 },
  ],
  correlationData: [
    { presence: 60, score: 65 },
    { presence: 75, score: 78 },
    { presence: 82, score: 85 },
    { presence: 78, score: 80 },
  ]
};

const StatCard = ({ title, value, icon: Icon, trend }: { 
  title: string; 
  value: string | number;
  icon: React.ElementType;
  trend?: number;
}) => {
  const trendColor = trend ? (trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600') : 'bg-blue-100 text-blue-600';
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {trend && (
            <span className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div className={`p-3 rounded-lg ${trendColor}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ title, icon: Icon, count }: { 
  title: string; 
  icon: React.ElementType;
  count?: number;
}) => (
  <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 w-full text-left">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        {count && (
          <span className="text-xs text-gray-500 mt-1">
            {count} actions en attente
          </span>
        )}
      </div>
      {count && (
        <span className="ml-auto bg-blue-600 text-white px-2.5 py-1 rounded-full text-sm">
          {count}
        </span>
      )}
    </div>
  </button>
);

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const DashboardPage = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simuler l'appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockData);
        setLoading(false);
      } catch (error) {
        toast.error('Erreur de chargement des données');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Tableau de bord</h2>
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-600" />
            <span className="text-gray-700 font-medium">Idrisschakam02</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Étudiants" 
            value={data.students} 
            icon={UserGroupIcon} 
            trend={2.5}
          />
          <StatCard
            title="Taux de présence"
            value={`${data.presenceRate}%`}
            icon={ChartBarIcon}
            trend={1.8}
          />
          <StatCard
            title="Séances"
            value={data.sessions}
            icon={CalendarIcon}
            trend={-0.5}
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Évolution des présences">
            <LineChart
              width={500}
              height={300}
              data={data.attendanceTrend}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="presence" 
                stroke="#3B82F6" 
                strokeWidth={2}
              />
            </LineChart>
          </ChartCard>

          <ChartCard title="Répartition par classe">
            <BarChart
              width={500}
              height={300}
              data={data.classDistribution}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="students" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartCard>

          <ChartCard title="Taux de présence global">
            <PieChart width={500} height={300}>
              <Pie
                data={data.presenceDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                fill="#3B82F6"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>

          <ChartCard title="Performance par matière">
            <RadarChart
              width={500}
              height={300}
              data={data.performanceData}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar 
                dataKey="score" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ChartCard>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;