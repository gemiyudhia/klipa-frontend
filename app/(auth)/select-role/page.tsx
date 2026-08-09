import RoleSelectorForm from '@/components/auth/RoleSelectorForm';
import { Suspense } from 'react';

export default function RoleSelectorPage() {
  return (
    <Suspense fallback={null}>
      <RoleSelectorForm />;
    </Suspense>
  );
}
