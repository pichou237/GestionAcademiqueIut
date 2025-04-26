// src/services/apiSeance.ts
import axios from 'axios';

// Configuration directe sans variables d'environnement
const API_BASE_URL = 'http://ec2-13-49-21-175.eu-north-1.compute.amazonaws.com:3000/';

export interface Teacher {
  id: string;
  nom: string;
  prenom: string;
  discipline: string;
  email: string;
  telephone: string;
  grade: string;
  salle: string;
}

export interface Session {
  id: string;
  date: string;
  teacherId: string;
  cours: string;
  salle: string;
  horaire: string;
  statut: 'planifié' | 'terminé' | 'annulé';
}

// Mock data pour le développement
const mockTeachers: Teacher[] = [
  {
    id: '1',
    nom: 'Mbarga',
    prenom: 'Jean-Paul',
    discipline: 'Mathématiques Appliquées',
    email: 'jp.mbarga@univ-yaounde1.cm',
    telephone: '+237 678453210',
    grade: 'Professeur Titulaire',
    salle: 'Bloc A, Bureau 104'
  }
];

const mockSessions: Session[] = [
  {
    id: '1',
    date: '2024-05-20',
    teacherId: '1',
    cours: 'Analyse Numérique',
    salle: 'Amphi 300',
    horaire: '8h-10h',
    statut: 'planifié'
  }
];

// Fonction pour détecter le mode développement
const isDevMode = () => {
  // return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
  return true;
};

// Opérations sur les séances
export const getSessionsWithTeachers = async (): Promise<(Session & { teacher: Teacher })[]> => {
  try {
    if (isDevMode()) {
      return mockSessions.map(session => ({
        ...session,
        teacher: mockTeachers.find(teacher => teacher.id === session.teacherId)!
      }));
    }

    const [sessionsResponse, teachersResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/enseignants`),
      axios.get(`${API_BASE_URL}/enseignants`)
    ]);

    return sessionsResponse.data.map((session: Session) => ({
      ...session,
      teacher: teachersResponse.data.find((teacher: Teacher) => teacher.id === session.teacherId)
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des séances:', error);
    throw new Error('Échec du chargement des séances');
  }
};

export const createSession = async (session: Omit<Session, 'id'>): Promise<Session> => {
  try {
    if (isDevMode()) {
      const newSession = { ...session, id: `mock-${Date.now()}` };
      mockSessions.push(newSession);
      return newSession;
    }
    const response = await axios.post(`${API_BASE_URL}/sessions`, session);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la séance:', error);
    throw new Error('Échec de la création de la séance');
  }
};

export const deleteSession = async (id: string): Promise<void> => {
  try {
    if (isDevMode()) {
      const index = mockSessions.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSessions.splice(index, 1);
      }
      return;
    }
    await axios.delete(`${API_BASE_URL}/enseignants/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de la séance:', error);
    throw new Error('Échec de la suppression de la séance');
  }
};

// src/services/apiSeance.ts

// ... (autres imports et interfaces)

export const updateSession = async (id: string, session: Partial<Session>): Promise<Session> => {
  try {
    if (isDevMode()) {
      // Mise à jour mock en développement
      const index = mockSessions.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSessions[index] = { ...mockSessions[index], ...session };
        return mockSessions[index];
      }
      throw new Error('Session not found');
    }
    
    // Appel API réel en production
    const response = await axios.patch(`${API_BASE_URL}/enseignants/${id}`, session);
    return response.data;
  } catch (error) {
    console.error('Error updating session:', error);
    throw new Error('Failed to update session');
  }
};

// Opérations sur les enseignants
export const getTeachers = async (): Promise<Teacher[]> => {
  try {
    if (isDevMode()) {
      return mockTeachers;
    }
    const response = await fetch(`${API_BASE_URL}/enseignants`); // Ajout du endpoint spécifique
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json(); // Appel de la méthode json()
    console.log('Données reçues:', data);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des enseignants:', error);
    throw new Error('Échec du chargement des enseignants');
  }
};

export const createTeacher = async (teacher: Omit<Teacher, 'id'>): Promise<Teacher> => {
  try {
    if (isDevMode()) {
      const newTeacher = { ...teacher, id: `mock-${Date.now()}` };
      mockTeachers.push(newTeacher);
      return newTeacher;
    }
    const response = await axios.post(`${API_BASE_URL}/enseignants`, teacher);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'enseignant:', error);
    throw new Error('Échec de la création de l\'enseignant');
  }
};

export const deleteTeacher = async (id: string): Promise<void> => {
  try {
    if (isDevMode()) {
      const index = mockTeachers.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTeachers.splice(index, 1);
      }
      return;
    }
    await axios.delete(`${API_BASE_URL}/enseignants/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'enseignant:', error);
    throw new Error('Échec de la suppression de l\'enseignant');
  }
};


// src/services/apiSeance.ts

// ... (autres fonctions existantes)

export const updateTeacher = async (id: string, teacher: Partial<Teacher>): Promise<Teacher> => {
  try {
    if (isDevMode()) {
      // Mock pour le développement
      const index = mockTeachers.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTeachers[index] = { ...mockTeachers[index], ...teacher };
        return mockTeachers[index];
      }
      throw new Error('Teacher not found');
    }

    // Appel API réel
    const response = await axios.patch(`${API_BASE_URL}/enseignants/${id}`, teacher);
    return response.data;
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw new Error('Failed to update teacher');
  }
};