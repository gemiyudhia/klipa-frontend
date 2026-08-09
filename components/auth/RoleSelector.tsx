'use client';

import RoleOption from './RoleOption';
import { ROLE_OPTIONS, RoleValue } from './RoleOptions';

export type { RoleValue };

interface RoleSelectorProps {
  value?: RoleValue;
  onChange: (value: RoleValue) => void;
  error?: string;
}

export default function RoleSelector({
  value,
  onChange,
  error,
}: RoleSelectorProps) {
  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Pilih role"
        className="grid gap-6 md:grid-cols-2"
      >
        {ROLE_OPTIONS.map((option) => (
          <RoleOption
            key={option.value}
            option={option}
            isSelected={value === option.value}
            onSelect={() => onChange(option.value)}
          />
        ))}
      </div>

      {error && (
        <p className="mt-3 text-sm font-bold text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
