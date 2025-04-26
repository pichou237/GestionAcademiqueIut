// src/pages/TeacherPage.tsx
import { useState, useEffect } from 'react';
import { 
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  type Teacher
} from '../../../services/apiSeance';
import { 
  AcademicCapIcon,
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';

const TeacherPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeachers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleSubmit = async (teacherData: Omit<Teacher, 'id'>) => {
    try {
      if (isEditing && currentTeacher) {
        const updatedTeacher = await updateTeacher(currentTeacher.id, teacherData);
        setTeachers(prev => 
          prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t)
        );
      } else {
        const newTeacher = await createTeacher(teacherData);
        setTeachers(prev => [...prev, newTeacher]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeacher(id);
      setTeachers(prev => prev.filter(t => t.id !== id));
      setDeleteCandidate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Erreur</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <AcademicCapIcon className="h-8 w-8 mr-3 text-blue-600" />
            Gestion des Enseignants
          </h1>
          <button
            onClick={() => {
              setIsEditing(false);
              setCurrentTeacher(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Nouvel Enseignant
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Nom', 'Prénom', 'Discipline', 'Grade', 'Contact', 'Actions'].map(header => (
                  <th 
                    key={header}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teachers.map(teacher => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{teacher.nom}</td>
                  <td className="px-6 py-4">{teacher.prenom}</td>
                  <td className="px-6 py-4">{teacher.discipline}</td>
                  <td className="px-6 py-4">{teacher.grade}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{teacher.email}</div>
                    <div className="text-sm text-gray-500">{teacher.telephone}</div>
                  </td>
                  <td className="px-6 py-4 flex space-x-4">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentTeacher(teacher);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(teacher.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TeacherModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={currentTeacher}
          isEditing={isEditing}
        />

        <ConfirmDialog
          isOpen={!!deleteCandidate}
          onClose={() => setDeleteCandidate(null)}
          onConfirm={() => deleteCandidate && handleDelete(deleteCandidate)}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer cet enseignant ?"
        />
      </div>
    </div>
  );
};

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Teacher, 'id'>) => void;
  initialData: Teacher | null;
  isEditing: boolean;
}

const TeacherModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  isEditing 
}: TeacherModalProps) => {
  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({
    nom: '',
    prenom: '',
    discipline: '',
    email: '',
    telephone: '',
    grade: '',
    salle: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nom: '',
        prenom: '',
        discipline: '',
        email: '',
        telephone: '',
        grade: '',
        salle: ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${isEditing ? 'Modifier' : 'Ajouter'} Enseignant`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discipline</label>
          <input
            type="text"
            value={formData.discipline}
            onChange={(e) => setFormData({...formData, discipline: e.target.value})}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
            <input
              type="text"
              value={formData.salle}
              onChange={(e) => setFormData({...formData, salle: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isEditing ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TeacherPage;