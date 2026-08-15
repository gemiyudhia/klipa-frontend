'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import {
  submitClipSchema,
  SubmitClipValue,
} from '@/lib/validations/clip.schema';
import { submitClip } from '@/lib/api/clip';

interface SubmitClipModalProps {
  campaignId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubmitClipModal({
  campaignId,
  onClose,
  onSuccess,
}: SubmitClipModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubmitClipValue>({
    resolver: zodResolver(submitClipSchema),
    defaultValues: {
      title: '',
      videoUrl: '',
      thumbnailUrl: '',
      duration: undefined,
    },
  });

  async function onSubmit(data: SubmitClipValue) {
    setIsSubmitting(true);
    try {
      await submitClip({
        campaignId,
        title: data.title,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || undefined,
        duration: data.duration,
      });
      toast.success('Klip berhasil disubmit! Nunggu di-review Creator.');
      onSuccess();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Gagal submit klip, coba lagi';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4">
      <div className="neo-card relative w-full max-w-lg bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border-2 border-black bg-white hover:bg-gray-100"
        >
          <X className="h-4 w-4 stroke-3" />
        </button>

        <h2 className="mb-6 text-2xl font-black uppercase text-black">
          Submit Klip Lu
        </h2>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    <p className="text-sm font-bold uppercase text-black">
                      Judul Klip
                    </p>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="Momen Clutch Ngeri"
                    className="border-3 border-black py-5"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="videoUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    <p className="text-sm font-bold uppercase text-black">
                      Link Video
                    </p>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="https://youtube.com/watch?v=..."
                    className="border-3 border-black py-5"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="thumbnailUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    <p className="text-sm font-bold uppercase text-black">
                      Link Thumbnail (Opsional)
                    </p>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="https://..."
                    className="border-3 border-black py-5"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="duration"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    <p className="text-sm font-bold uppercase text-black">
                      Durasi Detik (Opsional)
                    </p>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    placeholder="45"
                    className="border-3 border-black py-5"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="neo-button w-full py-6 text-base font-black uppercase"
          >
            {isSubmitting ? 'Lagi Ngirim...' : 'Kirim Klip Sekarang'}
          </Button>
        </form>
      </div>
    </div>
  );
}
