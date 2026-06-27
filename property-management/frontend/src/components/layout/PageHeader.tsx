import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    // Added flexbox so the title is on the left and the action button is on the right
    <div className="mt-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      <div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-wide text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-gray-600 opacity-90 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* The action button will snap to the right on desktop */}
      {action && <div>{action}</div>}
    </div>
  );
}