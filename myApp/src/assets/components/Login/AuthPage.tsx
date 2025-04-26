// src/pages/AuthPage.tsx
import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';

interface AuthPageProps {
  type: 'register' | 'login';
}

const AuthPage = ({ type }: AuthPageProps) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {type === 'register' ? 'Créer un compte' : 'Se connecter'}
      </h1>
      
      <AuthForm type={type} />

      <p className="text-center text-gray-600 mt-6">
        {type === 'register' ? (
          <>
            Déjà un compte ?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Connectez-vous
            </Link>
          </>
        ) : (
          <>
            Pas de compte ?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Inscrivez-vous
            </Link>
          </>
        )}
      </p>
    </div>
  </div>
);

export default AuthPage;