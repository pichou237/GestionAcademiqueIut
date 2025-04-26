// pages/SallePage.tsx
import { useEffect, useState } from 'react';
import SalleApiService, { Salle } from '../../../services/apiSalle';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const SallesPage = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSalle, setSelectedSalle] = useState<Salle | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await SalleApiService.getSalles();
      setSalles(data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des salles');
      setLoading(false);
    }
  };

  const filteredSalles = salles.filter(salle =>
    Object.values(salle).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedSalles = filteredSalles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Confirmer la suppression de cette salle ?')) {
      try {
        await SalleApiService.deleteSalle(id);
        setSalles(salles.filter(s => s.id !== id));
        toast.success('Salle supprimée avec succès');
      } catch (error) {
        toast.error('Échec de la suppression');
      }
    }
  };

  const handleSubmit = async (salleData: Omit<Salle, 'id'>) => {
    try {
      if (selectedSalle) {
        const updated = await SalleApiService.updateSalle(selectedSalle.id, salleData);
        setSalles(salles.map(s => s.id === selectedSalle.id ? updated! : s));
        toast.success('Salle mise à jour');
      } else {
        const created = await SalleApiService.createSalle(salleData);
        setSalles([...salles, created!]);
        toast.success('Salle créée avec succès');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Salles</h1>
            <p className="text-gray-500 mt-2">
              {filteredSalles.length} salle{filteredSalles.length > 1 ? 's' : ''} trouvée{filteredSalles.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            </div>

            <button
              onClick={() => {
                setSelectedSalle(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="hidden md:block">Nouvelle salle</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin mx-auto" />
            <p className="mt-4 text-gray-500">Chargement en cours...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Numéro', 'Bâtiment', 'Étage', 'Campus', 'Type', 'Actions'].map((header) => (
                    <th 
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {paginatedSalles.map((salle) => (
                  <tr key={salle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900">{salle.numero}</td>
                    <td className="px-4 py-4">{salle.batiment}</td>
                    <td className="px-4 py-4">{salle.etage}</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                        {salle.campus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{salle.type}</td>
                    <td className="px-4 py-4 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedSalle(salle);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(salle.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedSalles.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                Aucune salle trouvée
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <SalleFormModal
            salle={selectedSalle}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

// Composant Modal
const SalleFormModal = ({ salle, onClose, onSubmit }: {
  salle: Salle | null;
  onClose: () => void;
  onSubmit: (data: Omit<Salle, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState<Omit<Salle, 'id'>>({
    numero: salle?.numero || '',
    batiment: salle?.batiment || '',
    etage: salle?.etage || '',
    campus: salle?.campus || '',
    type: salle?.type || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {salle ? 'Modifier la salle' : 'Nouvelle salle'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.numero}
              onChange={(e) => setFormData({...formData, numero: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bâtiment</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.batiment}
              onChange={(e) => setFormData({...formData, batiment: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Étage</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.etage}
              onChange={(e) => setFormData({...formData, etage: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Campus</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.campus}
              onChange={(e) => setFormData({...formData, campus: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="">Sélectionner un type</option>
              <option value="Amphithéâtre">Amphithéâtre</option>
              <option value="Laboratoire">Laboratoire</option>
              <option value="Salle de cours">Salle de cours</option>
              <option value="Salle de réunion">Salle de réunion</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SallesPage;