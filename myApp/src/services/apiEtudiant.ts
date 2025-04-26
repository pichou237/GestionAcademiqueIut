import axios, { AxiosError, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ec2-13-49-21-175.eu-north-1.compute.amazonaws.com:3000/students',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export interface Etudiant {
  id: string;
  matricule: number;
  nom: string;
  prenom: string;
  email: string;
  classe: string;
}

class EtudiantApiService {
  static async getEtudiants(): Promise<Etudiant[]> {
    try {
      const response: AxiosResponse<Etudiant[]> = await axiosInstance.get('/');
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  static async getEtudiantById(id: string): Promise<Etudiant | null> {
    try {
      const response: AxiosResponse<Etudiant> = await axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  static async createEtudiant(etudiant: Omit<Etudiant, 'id'>): Promise<Etudiant | null> {
    try {
      const response: AxiosResponse<Etudiant> = await axiosInstance.post('/', etudiant);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  static async updateEtudiant(id: string, etudiant: Partial<Etudiant>): Promise<Etudiant | null> {
    try {
      const response: AxiosResponse<Etudiant> = await axiosInstance.put(`/${id}`, etudiant);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  static async deleteEtudiant(id: string): Promise<boolean> {
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
      console.error('Erreur API:', {
        status: axiosError.response.status,
        data: axiosError.response.data
      });
    } else {
      console.error('Erreur réseau:', axiosError.message);
    }
  }
}

export default EtudiantApiService;