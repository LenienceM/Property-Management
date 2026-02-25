// src/components/layout/PageHeader.tsx

type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="mt-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-wide">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg opacity-90">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}





