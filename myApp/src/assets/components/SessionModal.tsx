// src/components/SessionModal.tsx
import { useState, useEffect } from 'react';
import { 
  createSession,
  updateSession,
  type Session,
  type Teacher 
} from '../../services/apiSeance';
import Modal from './Modal';
import { 
  CalendarIcon,
  UserCircleIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface SessionWithTeacher extends Session {
  teacher?: Teacher;
}

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionWithTeacher | null;
  onSuccess: () => void;
}

const SessionModal = ({ 
  isOpen, 
  onClose, 
  session, 
  onSuccess 
}: SessionModalProps) => {
  const [formData, setFormData] = useState<Omit<Session, 'id'>>({
    date: '',
    teacherId: '',
    cours: '',
    salle: '',
    horaire: '',
    statut: 'planifié'
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      setFormData({
        date: session.date,
        teacherId: session.teacherId,
        cours: session.cours,
        salle: session.salle,
        horaire: session.horaire,
        statut: session.statut
      });
    } else {
      setFormData({
        date: '',
        teacherId: '',
        cours: '',
        salle: '',
        horaire: '',
        statut: 'planifié'
      });
    }
  }, [session]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/teachers');
        const data = await response.json();
        setTeachers(data);
      } catch (err) {
        console.error('Erreur chargement enseignants:', err);
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (session?.id) {
        await updateSession(session.id, formData);
      } else {
        await createSession(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={session ? 'Modifier la séance' : 'Créer une séance'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
              Enseignant
            </label>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un enseignant</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.prenom} {teacher.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <BookOpenIcon className="h-5 w-5 text-gray-400 mr-2" />
            Cours
          </label>
          <input
            type="text"
            value={formData.cours}
            onChange={(e) => setFormData({...formData, cours: e.target.value})}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
              Salle
            </label>
            <input
              type="text"
              value={formData.salle}
              onChange={(e) => setFormData({...formData, salle: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
              Horaire
            </label>
            <input
              type="text"
              value={formData.horaire}
              onChange={(e) => setFormData({...formData, horaire: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="8h-10h"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            value={formData.statut}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setFormData({...formData, statut: e.target.value as any})}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="planifié">Planifié</option>
            <option value="terminé">Terminé</option>
            <option value="annulé">Annulé</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : session ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SessionModal;