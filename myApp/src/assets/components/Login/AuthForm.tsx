// src/components/AuthForm.tsx
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from './FormInput';
import { Link } from 'react-router-dom';

interface FormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthFormProps {
  type: 'register' | 'login';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Bienvenue ! ${type === 'register' ? 'Inscription réussie' : 'Connexion réussie'}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {type === 'register' && (
        <FormInput
          type="text"
          name="name"
          label="Nom complet"
          register={register}
          errors={errors}
          validation={{ required: 'Ce champ est obligatoire' }}
        />
      )}

      <FormInput
        type="email"
        name="email"
        label="Adresse email"
        register={register}
        errors={errors}
        validation={{ 
          required: 'Ce champ est obligatoire',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Adresse email invalide'
          }
        }}
      />

      <FormInput
        type="password"
        name="password"
        label="Mot de passe"
        register={register}
        errors={errors}
        validation={{ 
          required: 'Ce champ est obligatoire',
          minLength: {
            value: 6,
            message: 'Minimum 6 caractères'
          }
        }}
      />

      {type === 'register' && (
        <FormInput
          type="password"
          name="confirmPassword"
          label="Confirmer le mot de passe"
          register={register}
          errors={errors}
          validation={{
            required: 'Ce champ est obligatoire',
            validate: (value: string) => 
              value === watch('password') || 'Les mots de passe ne correspondent pas'
          }}
        />
      )}

      

      <Link to="/DashboardPage" className="text-blue-600 hover:underline">
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
            
            {isSubmitting ? 'Chargement...' : type === 'register' ? "S'inscrire" : 'Se connecter'}
        </button>        
      </Link>
    </form>
  );
};

export default AuthForm;