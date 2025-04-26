// src/components/FormInput.tsx
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface FormInputProps {
  type: string;
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: FieldErrors;
  validation?: Record<string, unknown>;
}

const FormInput = ({ 
  type, 
  name, 
  label, 
  register, 
  errors,
  validation 
}: FormInputProps) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <input
      type={type}
      id={name}
      {...register(name, validation)}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
        errors[name] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
      }`}
    />
    {errors[name] && (
      <p className="text-red-500 text-xs mt-1">{(errors[name] as { message: string })?.message}</p>
    )}
  </div>
);

export default FormInput;