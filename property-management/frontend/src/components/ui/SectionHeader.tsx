import type { ReactNode } from "react"; // Ensure you use type-only import

interface Props {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  backgroundImage,
  children,
}: Props) {

  return (
    <section className="relative w-full h-[450px] md:h-[520px]">

      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      <div className="relative z-10 h-full flex items-center justify-center text-center text-white">


        <div className="max-w-3xl px-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-wide">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-6 text-lg opacity-90">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
