interface AuthFormHeaderProps {
  title: string;
  description: string;
}

export default function AuthFormHeader({
  title,
  description,
}: AuthFormHeaderProps) {
  return (
    <div className="my-8">
      <h2 className="text-xl font-bold text-gray-800 tracking-wide text-center">
        {title}
      </h2>
      <p className="text-lg font-extrabold text-gray-800 tracking-wide text-center">
        {description}
      </p>
    </div>
  );
}
