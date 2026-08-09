import { RoleOptionData } from "./RoleOptions";

interface RoleOptionProps {
  option: RoleOptionData;
  isSelected: boolean;
  onSelect: () => void;
}

export default function RoleOption({
  option,
  isSelected,
  onSelect,
}: RoleOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={`
        text-left
        p-6
        md:p-8
        border-4
        border-black
        neo-shadow
        transition-all
        duration-150
        cursor-pointer
        ${option.rotation}
        ${
          isSelected
            ? option.activeClass
            : `bg-card text-card-foreground ${option.hoverClass}`
        }
      `}
    >
      <div className="space-y-4">
        {option.icon}

        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase">
            {option.title}
          </h2>

          <p className="mt-2 text-sm md:text-base font-medium leading-relaxed">
            {option.description}
          </p>
        </div>
      </div>
    </button>
  );
}
