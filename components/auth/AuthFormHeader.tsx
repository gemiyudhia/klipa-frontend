interface AuthFormHeaderProps {
  title: string;
  description: string;
  background?: string
  titleColor?: string
  descriptionColor?: string
}

export default function AuthFormHeader({
  title,
  description,
  titleColor = 'text-white',
  descriptionColor = 'text-white',
  background = 'bg-secondary'
}: AuthFormHeaderProps) {
  return (
    <div
      className={`my-6 mx-2 ${background} px-4 py-3 border-3 border-black rotate-right md:my-8 md:px-6 md:py-4`}
    >
      <h2
        className={`text-xl font-bold ${titleColor} tracking-wide text-center md:text-3xl`}
      >
        {title}
      </h2>
      <p className={`text-lg font-extrabold ${descriptionColor} tracking-wide text-center md:text-2xl`}>
        {description}
      </p>
    </div>
  );
}
