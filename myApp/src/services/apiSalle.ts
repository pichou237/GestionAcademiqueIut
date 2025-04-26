// service/salleApi.ts
import axios, { AxiosError, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://c14e-129-0-76-156.ngrok-free.app/salles', // Adaptez l'URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export interface Salle {
  id: string;
  numero: string;
  batiment: string;
  etage: string;
  campus: string;
  type: string;
}

class SalleApiService {
  static async getSalles(): Promise<Salle[]> {
    try {
      const response: AxiosResponse<Salle[]> = await axiosInstance.get('/');
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  static async createSalle(salle: Omit<Salle, 'id'>): Promise<Salle | null> {
    try {
      const response: AxiosResponse<Salle> = await axiosInstance.post('/', salle);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  static async updateSalle(id: string, salle: Partial<Salle>): Promise<Salle | null> {
    try {
      const response: AxiosResponse<Salle> = await axiosInstance.put(`/${id}`, salle);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  static async deleteSalle(id: string): Promise<boolean> {
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
      console.error('Erreur API Salle:', {
        status: axiosError.response.status,
        data: axiosError.response.data
      });
    } else {
      console.error('Erreur réseau:', axiosError.message);
    }
  }
}

export default SalleApiService;