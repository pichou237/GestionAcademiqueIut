import axios, { AxiosError, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://votre-api.com/cours',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export interface VolumeHoraire {
  CM: number;
  TD: number;
  TP: number;
}

export interface Cours {
  id: string;
  intitule: string;
  code: string;
  credits: number;
  volumeHoraire: VolumeHoraire;
  semestre: string;
  niveau: string;
}

class CoursApiService {
  static async getCours(): Promise<Cours[]> {
    try {
      const response: AxiosResponse<Cours[]> = await axiosInstance.get('/');
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  static async createCours(cours: Omit<Cours, 'id'>): Promise<Cours | null> {
    try {
      const response: AxiosResponse<Cours> = await axiosInstance.post('/', cours);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  static async updateCours(id: string, cours: Partial<Cours>): Promise<Cours | null> {
    try {
      const response: AxiosResponse<Cours> = await axiosInstance.patch(`/${id}`, cours);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  static async deleteCours(id: string): Promise<boolean> {
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
      console.error('Erreur API Cours:', {
        status: axiosError.response.status,
        data: axiosError.response.data
      });
    } else {
      console.error('Erreur réseau:', axiosError.message);
    }
  }
}

export default CoursApiService;