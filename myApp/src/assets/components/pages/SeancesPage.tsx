// src/pages/SeancesPage.tsx
import { useState, useEffect } from 'react';
import { 
  getSessionsWithTeachers, 
  deleteSession,
  type Session,
  type Teacher
} from '../../../services/apiSeance';
import { 
  ClockIcon,
  UserCircleIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  PlusCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import ConfirmDialog from '../../components/ConfirmDialog';
import SessionModal from '../Modal';

interface SessionWithTeacher extends Session {
  teacher: Teacher;
}

const SeancesPage = () => {
  const [sessions, setSessions] = useState<SessionWithTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
// Extrait de SeancesPage.tsx
const [selectedSession, setSelectedSession] = useState<SessionWithTeacher | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const data = await getSessionsWithTeachers();
        if (isMounted) {
          setSessions(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erreur de chargement des séances');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      setDeleteCandidate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la suppression');
    }
  };

  const handleCreate = () => {
    setSelectedSession(null);
    setIsModalOpen(true);
  };

  const handleEdit = (session: SessionWithTeacher) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };


  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des séances en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-20">
        <div className="max-w-md text-center bg-red-50 p-6 rounded-lg">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Erreur</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => setRefreshTrigger(!refreshTrigger)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center mx-auto"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-18">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ClockIcon className="h-8 w-8 mr-3 text-blue-600" />
            Planning des Séances
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setRefreshTrigger(!refreshTrigger)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Actualiser
            </button>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Nouvelle Séance
            </button>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center">
            <p className="text-gray-500 text-lg">Aucune séance programmée</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Date', 'Enseignant', 'Cours', 'Salle', 'Horaire', 'Statut', 'Actions'].map(header => (
                    <th 
                      key={header}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessions.map(session => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      {formatDate(session.date)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium">
                          {session.teacher.prenom} {session.teacher.nom}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <BookOpenIcon className="h-5 w-5 text-blue-400 mr-2" />
                        {session.cours}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-green-400 mr-2" />
                        {session.salle}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono">{session.horaire}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        session.statut === 'planifié' ? 'bg-blue-100 text-blue-800' :
                        session.statut === 'terminé' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {session.statut === 'planifié' ? 'Planifié' : 
                         session.statut === 'terminé' ? 'Terminé' : 'Annulé'}
                      </span>
                    </td>
                    <td className="px-4 py-4 flex space-x-4">
                      <button
                        onClick={() => handleEdit(session)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="Modifier"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(session.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label="Supprimer"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmDialog
          isOpen={!!deleteCandidate}
          onClose={() => setDeleteCandidate(null)}
          onConfirm={() => deleteCandidate && handleDelete(deleteCandidate)}
          title="Confirmer la suppression"
          message="Êtes-vous sûr de vouloir supprimer cette séance ?"
          confirmText="Supprimer"
          cancelText="Annuler"
        />

        <SessionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          session={selectedSession}
          onSuccess={() => {
            setRefreshTrigger(prev => !prev);
          }}
        />
      </div>
    </div>
  );
};

export default SeancesPage;