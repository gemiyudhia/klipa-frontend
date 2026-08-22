import { RoleValue } from '@/components/auth/RoleSelector';
import * as z from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi.')
    .email('Format email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
});

export type signInSchemaValue = z.infer<typeof signInSchema>;

export const roleSchema = z.enum([
  'CREATOR',
  'CLIPPER',
]) satisfies z.ZodType<RoleValue>;

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi').max(100),
    email: z
      .string()
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi password wajib diisi'),
    role: roleSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak sama',
    path: ['confirmPassowrd'],
  });

export type signUpSchemaValue = z.infer<typeof signUpSchema>;
