'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { signUpSchema, signUpSchemaValue } from '@/lib/validations/auth.schema';

import { useAuthStore } from '@/store/authStore';

import SignUpProfileForm from './SignUpProfileForm';
import SignUpRoleStep from './SignUpRoleStep';

export default function SignUpForm() {
  const router = useRouter();

  const [step, setStep] = React.useState<'form' | 'role'>('form');

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<signUpSchemaValue>({
    resolver: zodResolver(signUpSchema),

    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },

    mode: 'onChange',
  });

  async function goToRoleStep() {
    const isValid = await form.trigger([
      'name',
      'email',
      'password',
      'confirmPassword',
    ]);

    if (!isValid) {
      return;
    }

    setStep('role');
  }

  async function onSubmit(data: signUpSchemaValue) {
    setIsSubmitting(true);
    try {
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      if (!registerRes.ok) {
        const error = await registerRes.json();
        throw { response: { data: error } };
      }

      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const profile = await loginRes.json();
      useAuthStore.getState().login(profile);

      toast.success('Akun berhasil dibuat!');
      router.push('/');
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Gagal mendaftar, coba lagi';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === 'form') {
    return <SignUpProfileForm control={form.control} onNext={goToRoleStep} />;
  }

  return (
    <SignUpRoleStep
      control={form.control}
      role={form.watch('role')}
      isSubmitting={isSubmitting}
      onSubmit={form.handleSubmit(onSubmit)}
      onBack={() => setStep('form')}
    />
  );
}
