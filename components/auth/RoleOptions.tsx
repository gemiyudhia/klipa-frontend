import { BsFillCameraReelsFill } from 'react-icons/bs';
import { RiScissorsFill } from 'react-icons/ri';

import RoleIcon from './RoleIcon';

export type RoleValue = 'CREATOR' | 'CLIPPER';

export interface RoleOptionData {
  value: RoleValue;
  icon: React.ReactNode;
  title: string;
  description: string;
  rotation: string;
  activeClass: string;
  hoverClass: string;
}

export const ROLE_OPTIONS: RoleOptionData[] = [
  {
    value: 'CREATOR',

    icon: (
      <RoleIcon>
        <BsFillCameraReelsFill />
      </RoleIcon>
    ),

    title: 'Gua Creator',

    description:
      'Gua yang bikin videonya. Butuh orang buat motong-motong biar viral.',

    rotation: 'rotate-left',

    activeClass:
      'bg-primary text-primary-foreground ring-4 ring-black scale-[1.02]',

    hoverClass: 'hover:bg-primary/20',
  },

  {
    value: 'CLIPPER',

    icon: (
      <RoleIcon>
        <RiScissorsFill />
      </RoleIcon>
    ),

    title: 'Gua Clipper',

    description: 'Gua yang bakal motong video lu biar jadi konten mantap.',

    rotation: 'rotate-right',

    activeClass:
      'bg-secondary text-secondary-foreground ring-4 ring-black scale-[1.02]',

    hoverClass: 'hover:bg-secondary/20',
  },
];
