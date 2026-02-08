import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: Props) {
  return (
    <div className={`glass rounded-xl p-6 bg-white/[0.02] ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}
