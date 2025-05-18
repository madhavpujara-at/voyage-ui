import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { RegisterUserRequestDto } from '../../application/dtos/RegisterUserRequestDto';

interface FormField {
  value: string;
  error: string | null;
}

interface RegisterFields {
  name: FormField;
  email: FormField;
  password: FormField;
  confirmPassword: FormField;
}

interface UseRegisterFormProps {
  initialFields?: Partial<RegisterFields>;
  onSubmit: (formData: RegisterUserRequestDto) => Promise<unknown>;
  redirectPath: string;
}

export const useRegisterForm = ({ initialFields = {}, onSubmit, redirectPath }: UseRegisterFormProps) => {
  const defaultFields: RegisterFields = {
    name: { value: '', error: null },
    email: { value: '', error: null },
    password: { value: '', error: null },
    confirmPassword: { value: '', error: null },
    ...initialFields,
  };

  const [fields, setFields] = useState<RegisterFields>(defaultFields);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof RegisterFields],
        value,
        error: null, // Clear field-specific error on change
      },
    }));

    // Clear general error when user starts correcting the form
    if (generalError) {
      setGeneralError(null);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newFields = { ...fields };

    // Basic validation - required fields
    Object.entries(newFields).forEach(([key, field]) => {
      if (!field.value.trim()) {
        newFields[key as keyof RegisterFields] = {
          ...field,
          error: `${key.charAt(0).toUpperCase() + key.slice(1)} is required`,
        };
        isValid = false;
      }
    });

    // Email validation
    if (newFields.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newFields.email.value)) {
      newFields.email.error = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation - match API requirements
    if (newFields.password.value) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newFields.password.value)) {
        newFields.password.error =
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
        isValid = false;
      }
    }

    // Confirm password validation
    if (
      newFields.password.value &&
      newFields.confirmPassword.value &&
      newFields.confirmPassword.value !== newFields.password.value
    ) {
      newFields.confirmPassword.error = 'Passwords do not match';
      isValid = false;
    }

    setFields(newFields);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      // Create RegisterUserRequestDto from form fields
      const registerData: RegisterUserRequestDto = {
        name: fields.name.value,
        email: fields.email.value,
        password: fields.password.value,
      };

      const result = await onSubmit(registerData);

      // Only redirect on successful registration (when we have a result)
      if (result) {
        router.push(redirectPath);
      }
    } catch (error) {
      console.error('Registration form submission error:', error);
      setGeneralError(error instanceof Error ? error.message : 'An unexpected error occurred');
      // Stay on the current page when there's an error - don't redirect
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fields,
    setFields,
    handleChange,
    handleSubmit,
    isSubmitting,
    generalError,
    setGeneralError,
  };
};
