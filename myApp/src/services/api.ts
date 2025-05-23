// src/services/api.ts
export interface Student {
    matricule: number;
    nom: string;
    prenom: string;
    email:string;
    classe:string
    // Ajouter d'autres champs selon la réponse de l'API
  }
  
  export const fetchStudents = async (): Promise<Student[]> => {
    try {
      const response = await fetch('http://ec2-13-49-21-175.eu-north-1.compute.amazonaws.com:3000/students');
      if (!response.ok) throw new Error('Erreur de récupération des données');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  };