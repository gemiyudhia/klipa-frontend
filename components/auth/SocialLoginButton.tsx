import type { ReactNode } from 'react';
import { Button } from '../ui/button';

interface SocialLoginButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export default function SocialLoginButton({
  icon,
  label,
  onClick,
}: SocialLoginButtonProps) {
  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        className="w-full h-12 neo-button text-black font-extrabold text-sm uppercase tracking-wide border-4 border-black rounded-none neo-shadow hover:neo-button  transition-none flex items-center justify-center gap-2"
      >
        {icon}
        <span className="md:text-xl">{label}</span>
      </Button>
    </div>
  );
}
