import { ReactNode } from "react";

type SectionProps = {
  id?: string;
  label?: string;
  title?: string;
  description?: string;
  children: ReactNode;
};

export default function Section({
  id,
  label,
  title,
  description,
  children,
}: SectionProps) {
  return (
    <section id={id} className="flex flex-col gap-4">
      {(label || title || description) && (
        <header className="flex flex-col gap-2">
          {label && <span className="section-label">{label}</span>}
          {title && (
            <h2 className="text-xl font-bold text-brand-900">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-brand-800/70">{description}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
