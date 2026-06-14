import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost" | "glow";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50";

  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-brand-500 text-white shadow-glass hover:bg-brand-600",
    glow: "bg-gradient-to-r from-brand-500 to-orange-500 text-white shadow-glow-lg hover:from-brand-600 hover:to-orange-600",
    ghost:
      "border border-brand-300/70 bg-white/50 text-brand-700 backdrop-blur hover:bg-white/70",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
