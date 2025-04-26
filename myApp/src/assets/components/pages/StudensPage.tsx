// src/pages/StudentsPage.tsx
import { useEffect, useState } from 'react';
import EtudiantApiService, { Etudiant } from '../../../services/apiEtudiant'
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentsPage = () => {
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Etudiant | null>(null);
  const itemsPerPage = 8;

  // Chargement initial des données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await EtudiantApiService.getEtudiants();
      setStudents(data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors du chargement des étudiants');
      setLoading(false);
    }
  };

  // Filtrage et pagination
  const filteredStudents = students.filter(student =>
    Object.values(student).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Gestion CRUD
  const handleDelete = async (id: string) => {
    if (window.confirm('Confirmer la suppression de cet étudiant ?')) {
      try {
        await EtudiantApiService.deleteEtudiant(id);
        setStudents(students.filter(s => s.id !== id));
        toast.success('Étudiant supprimé avec succès');
      } catch (error) {
        toast.error('Échec de la suppression');
      }
    }
  };

  const handleSubmit = async (studentData: Omit<Etudiant, 'id'>) => {
    try {
      if (selectedStudent) {
        const updated = await EtudiantApiService.updateEtudiant(selectedStudent.id, studentData);
        setStudents(students.map(s => s.id === selectedStudent.id ? updated! : s));
        toast.success('Étudiant mis à jour');
      } else {
        const created = await EtudiantApiService.createEtudiant(studentData);
        setStudents([...students, created!]);
        toast.success('Étudiant créé avec succès');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen mt-10">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Étudiants</h1>
            <p className="text-gray-500 mt-2">
              {filteredStudents.length} étudiant{filteredStudents.length > 1 ? 's' : ''} trouvé{filteredStudents.length > 1 ? 's' : ''}
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

               {/* Nouveau bouton amélioré */}
               <button
                  onClick={() => {
                    setSelectedStudent(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                >
                  <PlusIcon className="h-5 w-5 stroke-[1.5]" />
                  <span>Nouvel étudiant</span>
                </button>
          </div>
        </div>

        {/* Tableau */}
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
                  {['Matricule', 'Nom', 'Prénom', 'Email', 'Classe', 'Actions'].map((header) => (
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
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900">#{student.matricule}</td>
                    <td className="px-4 py-4">{student.nom}</td>
                    <td className="px-4 py-4">{student.prenom}</td>
                    <td className="px-4 py-4">
                      <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline">
                        {student.email}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                        {student.classe}
                      </span>
                    </td>
                    <td className="px-4 py-4 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {paginatedStudents.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                Aucun étudiant trouvé
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <StudentFormModal
            student={selectedStudent}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

// Composant Modal pour le formulaire
const StudentFormModal = ({ student, onClose, onSubmit }: {
  student: Etudiant | null;
  onClose: () => void;
  onSubmit: (data: Omit<Etudiant, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState<Omit<Etudiant, 'id'>>({
    matricule: student?.matricule || 0,
    nom: student?.nom || '',
    prenom: student?.prenom || '',
    email: student?.email || '',
    classe: student?.classe || ''
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
            {student ? 'Modifier étudiant' : 'Nouvel étudiant'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Matricule</label>
            <input
              type="number"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.matricule}
              onChange={(e) => setFormData({...formData, matricule: parseInt(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.prenom}
              onChange={(e) => setFormData({...formData, prenom: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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

export default StudentsPage;