// pages/PresencePage.tsx
import { useEffect, useState } from 'react';
import PresenceApiService, { Presence, Etudiant } from '../../../services/apiPresence';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon, UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PresencePage = () => {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPresence, setSelectedPresence] = useState<Presence | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await PresenceApiService.getPresences();
      setPresences(data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des présences');
      setLoading(false);
    }
  };

  const filteredPresences = presences.filter(presence =>
    Object.values(presence).some(value =>
      typeof value === 'string' ? value.toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
  );

  const paginatedPresences = filteredPresences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Confirmer la suppression de cette présence ?')) {
      try {
        await PresenceApiService.deletePresence(id);
        setPresences(presences.filter(p => p.id !== id));
        toast.success('Présence supprimée avec succès');
      } catch (error) {
        toast.error('Échec de la suppression');
      }
    }
  };

  const handleTogglePresence = async (presenceId: string, etudiant: Etudiant) => {
    try {
      const updatedPresence = await PresenceApiService.updatePresence(presenceId, {
        etudiants: presences.find(p => p.id === presenceId)?.etudiants.map(e => 
          e.matricule === etudiant.matricule ? { ...e, present: !e.present } : e
        )
      });
      setPresences(presences.map(p => p.id === presenceId ? updatedPresence! : p));
    } catch (error) {
      toast.error('Échec de la mise à jour');
    }
  };

  const handleSubmit = async (presenceData: Omit<Presence, 'id'>) => {
    try {
      if (selectedPresence) {
        const updated = await PresenceApiService.updatePresence(selectedPresence.id, presenceData);
        setPresences(presences.map(p => p.id === selectedPresence.id ? updated! : p));
        toast.success('Présence mise à jour');
      } else {
        const created = await PresenceApiService.createPresence(presenceData);
        setPresences([...presences, created!]);
        toast.success('Présence créée avec succès');
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Présences</h1>
            <p className="text-gray-500 mt-2">
              {filteredPresences.length} séance{filteredPresences.length > 1 ? 's' : ''} trouvée{filteredPresences.length > 1 ? 's' : ''}
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
                setSelectedPresence(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="hidden md:block">Nouvelle séance</span>
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
                  {['Date', 'Cours', 'Enseignant', 'Salle', 'Classe', 'Présences', 'Actions'].map((header) => (
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
                {paginatedPresences.map((presence) => (
                  <tr key={presence.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      {new Date(presence.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium">{presence.cours.intitule}</div>
                      <div className="text-sm text-gray-500">{presence.cours.code}</div>
                    </td>
                    <td className="px-4 py-4">
                      {presence.enseignant.prenom} {presence.enseignant.nom}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                        {presence.salle.batiment} - {presence.salle.numero}
                      </span>
                    </td>
                    <td className="px-4 py-4">{presence.classe}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {presence.etudiants.filter(e => e.present).length}/{presence.etudiants.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedPresence(presence);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(presence.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedPresences.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                Aucune séance trouvée
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <PresenceFormModal
            presence={selectedPresence}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            onTogglePresence={handleTogglePresence}
          />
        )}
      </div>
    </div>
  );
};

// Composant Modal
const PresenceFormModal = ({ presence, onClose, onSubmit, onTogglePresence }: {
    presence: Presence | null;
    onClose: () => void;
    onSubmit: (data: Omit<Presence, 'id'>) => void;
    onTogglePresence?: (presenceId: string, etudiant: Etudiant) => void;
  }) => {
    const [formData, setFormData] = useState<Omit<Presence, 'id'>>(presence || {
      date: new Date().toISOString().split('T')[0],
      cours: { 
        code: '', 
        intitule: '', 
        niveau: '', 
        semestre: '' 
      },
      enseignant: { 
        email: '', 
        nom: '', 
        prenom: '' 
      },
      salle: { 
        id: '',
        numero: '', 
        batiment: '', 
        etage: '',
        campus: '',
        type: '' 
      },
      classe: '',
      etudiants: [] as Etudiant[]
    });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {presence ? 'Modifier la présence' : 'Nouvelle séance'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Classe</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.classe}
                onChange={(e) => setFormData({...formData, classe: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cours</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Code du cours"
                value={formData.cours.code}
                onChange={(e) => setFormData({
                  ...formData,
                  cours: { ...formData.cours, code: e.target.value }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Enseignant</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Nom"
                value={formData.enseignant.nom}
                onChange={(e) => setFormData({
                  ...formData,
                  enseignant: { ...formData.enseignant, nom: e.target.value }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Salle</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Bâtiment"
                value={formData.salle.batiment}
                onChange={(e) => setFormData({
                  ...formData,
                  salle: { ...formData.salle, batiment: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-sm font-medium mb-2">Liste des étudiants</h4>
            <div className="space-y-2">
              {formData.etudiants.map((etudiant) => (
                <div key={etudiant.matricule} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>
                    {etudiant.prenom} {etudiant.nom} ({etudiant.matricule})
                  </span>
                  <button
                    type="button"
                    onClick={() => onTogglePresence?.(presence?.id || '', etudiant)}
                    className={`px-2 py-1 rounded ${etudiant.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {etudiant.present ? 'Présent' : 'Absent'}
                  </button>
                </div>
              ))}
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

export default PresencePage;