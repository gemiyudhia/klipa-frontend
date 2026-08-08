'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { IoMdMail } from 'react-icons/io';
import Image from 'next/image';
import Link from 'next/link';
import { LuMoveRight, LuUserPlus } from 'react-icons/lu';
import { MdVpnKey } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { loginSchema, loginSchemaValue } from '@/lib/validations/auth.schema';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/store/authStore';
import AuthFormHeader from './AuthFormHeader';
import AuthDivider from './AuthDivider';
import SocialLoginButton from './SocialLoginButton';

export default function LoginForm() {
  const router = useRouter();
  const [isSubmmitting, setIsSubmitting] = React.useState<boolean>(false);

  const form = useForm<loginSchemaValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: loginSchemaValue) {
    setIsSubmitting(true);
    try {
      const { data: tokens } = await apiClient.post('/auth/login', data);
      const { data: profile } = await apiClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      useAuthStore
        .getState()
        .login(profile, tokens.access_token, tokens.refresh_token);

      toast.success('Berhasil Masuk!');
      router.push('/');
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Email atau kata sandi salah bre';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="bg-transparent border-0 shadow-none ring-0 md:bg-white md:border-black md:shadow-[9px_9px_0px_black]">
      <CardHeader className="flex items-center flex-col pb-8">
        <Image
          src="/brand/klipa-logo.svg"
          alt="logo klipa"
          width={100}
          height={100}
          loading="eager"
          className="rotate-right flex items-center justify-center w-full sticky"
        />
        <CardDescription className="my-3">
          <AuthFormHeader
            title="Halo!!!"
            description="Selamat datang di Klipa"
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    <IoMdMail className="text-lg text-gray-800 md:text-2xl" />
                    <p className="text-gray-800 font-bold text-lg tracking-wide md:text-2xl">
                      Alamat Email
                    </p>
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="lu@contoh.com"
                    autoComplete="off"
                    className="py-6 border-4 neo-input tracking-wide focus:tracking-wide md:text-xl"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    <MdVpnKey className="text-lg text-gray-800 md:text-2xl" />
                    <p className="text-gray-800 font-bold text-lg tracking-wide md:text-2xl">
                      Kata Sandi
                    </p>
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukin kata sandi lu"
                    autoComplete="off"
                    className="py-6 border-4 neo-input tracking-wide focus:tracking-wide md:text-xl"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="text-right">
              <Link
                href="#"
                className="underline underline-offset-4 font-bold text-lg text-gray-800 transition-none tracking-wide md:text-2xl"
              >
                Lupa sandi?
              </Link>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="border-none bg-transparent pb-8">
        <Field orientation="vertical" className="pt-2">
          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full h-12 neo-button text-black font-extrabold text-sm uppercase border-4 border-black rounded-none active:shadow-none transition-none flex items-center justify-center gap-2 tracking-wide"
            >
              <span className="md:text-xl">Masuk Kuy</span>
              <LuMoveRight className="w-5 h-5 stroke-[2.5]" />
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 neo-button text-black font-extrabold text-sm uppercase tracking-wide border-4 border-black rounded-none neo-shadow transition-none flex items-center justify-center gap-2"
            >
              <LuUserPlus className="w-5 h-5 stroke-[2.5]" />
              <span className="md:text-xl">Daftar Akun Baru</span>
            </Button>
          </div>

          <AuthDivider />
          <SocialLoginButton
            icon={<FcGoogle className="w-5 h-5" />}
            label="Login pake Google"
          ></SocialLoginButton>
        </Field>
      </CardFooter>
    </Card>
  );
}
