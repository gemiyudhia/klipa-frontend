'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { signUpSchema, signUpSchemaValue } from '@/lib/validations/auth.schema';

import apiClient from '@/lib/api/client';
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
      await apiClient.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      const { data: tokens } = await apiClient.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { data: profile } = await apiClient.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      useAuthStore
        .getState()
        .login(profile, tokens.access_token, tokens.refresh_token);

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
