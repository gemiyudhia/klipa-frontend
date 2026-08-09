'use client';

import { Button } from '@/components/ui/button';
import { Control, Controller } from 'react-hook-form';

import RoleSelector from './RoleSelector';

import { signUpSchemaValue } from '@/lib/validations/auth.schema';

interface SignUpRoleStepProps {
  control: Control<signUpSchemaValue>;
  role?: 'CREATOR' | 'CLIPPER';
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export default function SignUpRoleStep({
  control,
  role,
  isSubmitting,
  onSubmit,
  onBack,
}: SignUpRoleStepProps) {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          Lu Pengen Jadi Apa?
        </h1>

        <p className="mt-2 text-base md:text-lg font-medium text-muted-foreground">
          Mau ngasih bahan video atau nyulap video jadi emas?
        </p>
      </header>

      <Controller
        name="role"
        control={control}
        render={({ field, fieldState }) => (
          <RoleSelector
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <footer className="mt-10 flex flex-col gap-3">
        <Button
          type="button"
          disabled={!role || isSubmitting}
          onClick={onSubmit}
          className="w-full h-14 bg-tertiary text-tertiary-foreground font-black text-lg md:text-xl uppercase border-4 border-black rounded-none neo-shadow neo-press transition-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Lagi Daftar...' : 'Daftar Sekarang'}
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="font-bold text-base text-gray-800 underline underline-offset-4"
        >
          Balik Edit Data
        </button>
      </footer>
    </main>
  );
}
