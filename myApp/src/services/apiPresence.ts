import axios, { AxiosError, AxiosResponse } from 'axios';
import { Etudiant as BaseEtudiant } from './apiEtudiant';
import { Salle as BaseSalle } from './apiSalle';

const axiosInstance = axios.create({
  baseURL: 'https://c14e-129-0-76-156.ngrok-free.app/presences',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export interface Cours {
  code: string;
  intitule: string;
  niveau: string;
  semestre: string;
}

export interface Enseignant {
  email: string;
  nom: string;
  prenom: string;
}

export interface Salle extends BaseSalle {
  id: string;
  numero: string;
  batiment: string;
  etage: string;
  campus: string;
  type: string;
}

export interface Etudiant extends BaseEtudiant {
  matricule: number;
  present: boolean;
}

export interface Presence {
  id: string;
  date: string;
  cours: Cours;
  enseignant: Enseignant;
  salle: Salle;
  classe: string;
  etudiants: Etudiant[];
}

class PresenceApiService {
  static async getPresences(): Promise<Presence[]> {
    try {
      const response: AxiosResponse<Presence[]> = await axiosInstance.get('/');
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  static async createPresence(presence: Omit<Presence, 'id'>): Promise<Presence | null> {
    try {
      const response: AxiosResponse<Presence> = await axiosInstance.post('/', presence);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  static async updatePresence(id: string, presence: Partial<Presence>): Promise<Presence | null> {
    try {
      const response: AxiosResponse<Presence> = await axiosInstance.patch(`/${id}`, presence);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  static async deletePresence(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(`/${id}`);
      return true;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  private static handleError(error: unknown): void {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error('Erreur API Presence:', {
        status: axiosError.response.status,
        data: axiosError.response.data
      });
    } else {
      console.error('Erreur réseau:', axiosError.message);
    }
  }
}

export default PresenceApiService;