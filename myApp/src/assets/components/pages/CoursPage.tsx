import { useEffect, useState } from 'react';
import CoursApiService, { Cours } from '../../../services/apiCours';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const CoursPage = () => {
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCours, setSelectedCours] = useState<Cours | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await CoursApiService.getCours();
      setCours(data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des cours');
      setLoading(false);
    }
  };

  const filteredCours = cours.filter(c => 
    Object.values(c).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedCours = filteredCours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Confirmer la suppression de ce cours ?')) {
      try {
        await CoursApiService.deleteCours(id);
        setCours(cours.filter(c => c.id !== id));
        toast.success('Cours supprimé avec succès');
      } catch (error) {
        toast.error('Échec de la suppression');
      }
    }
  };

  const handleSubmit = async (coursData: Omit<Cours, 'id'>) => {
    try {
      if (selectedCours) {
        const updated = await CoursApiService.updateCours(selectedCours.id, coursData);
        setCours(cours.map(c => c.id === selectedCours.id ? updated! : c));
        toast.success('Cours mis à jour');
      } else {
        const created = await CoursApiService.createCours(coursData);
        setCours([...cours, created!]);
        toast.success('Cours créé avec succès');
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Cours</h1>
            <p className="text-gray-500 mt-2">
              {filteredCours.length} cours trouvés
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
                setSelectedCours(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="hidden md:block">Nouveau cours</span>
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
                  {['Code', 'Intitulé', 'Crédits', 'Volume Horaire', 'Semestre', 'Niveau', 'Actions'].map((header) => (
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
                {paginatedCours.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900">{c.code}</td>
                    <td className="px-4 py-4">{c.intitule}</td>
                    <td className="px-4 py-4">{c.credits}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <span>CM: {c.volumeHoraire.CM}h</span>
                        <span>TD: {c.volumeHoraire.TD}h</span>
                        <span>TP: {c.volumeHoraire.TP}h</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">{c.semestre}</td>
                    <td className="px-4 py-4">{c.niveau}</td>
                    <td className="px-4 py-4 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedCours(c);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedCours.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                Aucun cours trouvé
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <CoursFormModal
            cours={selectedCours}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

const CoursFormModal = ({ cours, onClose, onSubmit }: {
  cours: Cours | null;
  onClose: () => void;
  onSubmit: (data: Omit<Cours, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState<Omit<Cours, 'id'>>(cours || {
    intitule: '',
    code: '',
    credits: 0,
    volumeHoraire: { CM: 0, TD: 0, TP: 0 },
    semestre: '',
    niveau: ''
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
            {cours ? 'Modifier cours' : 'Nouveau cours'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Intitulé</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.intitule}
              onChange={(e) => setFormData({...formData, intitule: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Crédits</label>
            <input
              type="number"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.credits}
              onChange={(e) => setFormData({...formData, credits: Number(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Volume Horaire</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="CM"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.volumeHoraire.CM}
                  onChange={(e) => setFormData({
                    ...formData,
                    volumeHoraire: {...formData.volumeHoraire, CM: Number(e.target.value)}
                  })}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="TD"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.volumeHoraire.TD}
                  onChange={(e) => setFormData({
                    ...formData,
                    volumeHoraire: {...formData.volumeHoraire, TD: Number(e.target.value)}
                  })}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="TP"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.volumeHoraire.TP}
                  onChange={(e) => setFormData({
                    ...formData,
                    volumeHoraire: {...formData.volumeHoraire, TP: Number(e.target.value)}
                  })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Semestre</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.semestre}
                onChange={(e) => setFormData({...formData, semestre: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Niveau</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.niveau}
                onChange={(e) => setFormData({...formData, niveau: e.target.value})}
              />
            </div>
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

export default CoursPage;